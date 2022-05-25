import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721TokenStatus, IErc721AssetSearchDto } from "@framework/types";

import { Erc721TokenEntity } from "./token.entity";
import { UserEntity } from "../../user/user.entity";
import { IErc721AutocompleteDto } from "./interface";

@Injectable()
export class Erc721TokenService {
  constructor(
    @InjectRepository(Erc721TokenEntity)
    private readonly erc721TokenEntityRepository: Repository<Erc721TokenEntity>,
  ) {}

  public async search(dto: IErc721AssetSearchDto, userEntity: UserEntity): Promise<[Array<Erc721TokenEntity>, number]> {
    const { skip, take, rarity, erc721CollectionIds } = dto;

    const queryBuilder = this.erc721TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc721Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc721Collection", "collectionToken");
    queryBuilder.leftJoinAndSelect("token.erc721Dropbox", "dropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc721Collection", "collectionDropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc721Template", "dropboxTemplate");

    queryBuilder.andWhere("token.owner = :owner", { owner: userEntity.wallet?.toLowerCase() });

    if (rarity) {
      if (rarity.length === 1) {
        queryBuilder.andWhere("token.rarity = :rarity", { rarity: rarity[0] });
      } else {
        queryBuilder.andWhere("token.rarity IN(:...rarity)", { rarity });
      }
    }

    if (erc721CollectionIds) {
      if (erc721CollectionIds.length === 1) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where("template.erc721CollectionId = :erc721CollectionId", {
              erc721CollectionId: erc721CollectionIds[0],
            });
            qb.orWhere("dropbox.erc721CollectionId = :erc721CollectionId", {
              erc721CollectionId: erc721CollectionIds[0],
            });
          }),
        );
      } else {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where("template.erc721CollectionId IN(:...erc721CollectionIds)", { erc721CollectionIds });
            qb.orWhere("dropbox.erc721CollectionId IN(:...erc721CollectionIds)", { erc721CollectionIds });
          }),
        );
      }
    }

    queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: Erc721TokenStatus.MINTED });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc721AutocompleteDto): Promise<Array<Erc721TokenEntity>> {
    const { wallet } = dto;
    const queryBuilder = this.erc721TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select(["id", "tokenId"]);
    queryBuilder.andWhere("token.owner = :owner", { owner: wallet });

    queryBuilder.leftJoin("token.template", "template");
    queryBuilder.addSelect(["template.title"]);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });
    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<Erc721TokenEntity>,
    options?: FindOneOptions<Erc721TokenEntity>,
  ): Promise<Erc721TokenEntity | null> {
    return this.erc721TokenEntityRepository.findOne({ where, ...options });
  }

  public findOnePlus(where: FindOptionsWhere<Erc721TokenEntity>): Promise<Erc721TokenEntity | null> {
    const queryBuilder = this.erc721TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();
    queryBuilder.where(where);

    queryBuilder.leftJoinAndSelect("token.history", "history");
    queryBuilder.leftJoinAndSelect("token.erc721Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc721Collection", "collection");

    return queryBuilder.getOne();
  }
}
