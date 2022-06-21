import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998TokenStatus, IErc998AssetSearchDto } from "@framework/types";

import { Erc998TokenEntity } from "./token.entity";
import { UserEntity } from "../../user/user.entity";
import { IErc998TokenAutocompleteDto } from "./interface";

@Injectable()
export class Erc998TokenService {
  constructor(
    @InjectRepository(Erc998TokenEntity)
    private readonly erc998TokenEntityRepository: Repository<Erc998TokenEntity>,
  ) {}

  public async search(dto: IErc998AssetSearchDto, userEntity: UserEntity): Promise<[Array<Erc998TokenEntity>, number]> {
    const { skip, take, rarity, erc998CollectionIds } = dto;

    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collectionToken");
    queryBuilder.leftJoinAndSelect("token.erc998Dropbox", "dropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc998Collection", "collectionDropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc998Template", "dropboxTemplate");

    queryBuilder.andWhere("token.owner = :owner", { owner: userEntity.wallet?.toLowerCase() });

    if (rarity) {
      if (rarity.length === 1) {
        queryBuilder.andWhere("token.rarity = :rarity", { rarity: rarity[0] });
      } else {
        queryBuilder.andWhere("token.rarity IN(:...rarity)", { rarity });
      }
    }

    if (erc998CollectionIds) {
      if (erc998CollectionIds.length === 1) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where("template.erc998CollectionId = :erc998CollectionId", {
              erc998CollectionId: erc998CollectionIds[0],
            });
            qb.orWhere("dropbox.erc998CollectionId = :erc998CollectionId", {
              erc998CollectionId: erc998CollectionIds[0],
            });
          }),
        );
      } else {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where("template.erc998CollectionId IN(:...erc998CollectionIds)", { erc998CollectionIds });
            qb.orWhere("dropbox.erc998CollectionId IN(:...erc998CollectionIds)", { erc998CollectionIds });
          }),
        );
      }
    }

    queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: Erc998TokenStatus.MINTED });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc998TokenAutocompleteDto): Promise<Array<Erc998TokenEntity>> {
    const { wallet } = dto;
    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

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
    where: FindOptionsWhere<Erc998TokenEntity>,
    options?: FindOneOptions<Erc998TokenEntity>,
  ): Promise<Erc998TokenEntity | null> {
    return this.erc998TokenEntityRepository.findOne({ where, ...options });
  }

  public findOnePlus(where: FindOptionsWhere<Erc998TokenEntity>): Promise<Erc998TokenEntity | null> {
    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();
    queryBuilder.where(where);

    queryBuilder.leftJoinAndSelect("token.history", "history");
    queryBuilder.leftJoinAndSelect("token.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collection");

    return queryBuilder.getOne();
  }

  public getToken(address: string, tokenId: string): Promise<Erc998TokenEntity | null> {
    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collection");

    queryBuilder.andWhere("collection.address = :address", {
      address,
    });

    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }
}
