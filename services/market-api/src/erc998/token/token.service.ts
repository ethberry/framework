import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc998AssetSearchDto, UniTokenStatus } from "@framework/types";

import { UserEntity } from "../../user/user.entity";
import { IUniTokenAutocompleteDto } from "./interface";
import { UniTokenEntity } from "../../blockchain/uni-token/uni-token/uni-token.entity";

@Injectable()
export class Erc998TokenService {
  constructor(
    @InjectRepository(UniTokenEntity)
    private readonly erc998TokenEntityRepository: Repository<UniTokenEntity>,
  ) {}

  public async search(dto: IErc998AssetSearchDto, userEntity: UserEntity): Promise<[Array<UniTokenEntity>, number]> {
    const { skip, take, rarity, uniContractIds } = dto;

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
        queryBuilder.andWhere("token.attributes->>'rarity' = :rarity", { rarity: rarity[0] });
      } else {
        queryBuilder.andWhere("token.attributes->>'rarity' IN(:...rarity)", { rarity });
      }
    }

    if (uniContractIds) {
      if (uniContractIds.length === 1) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where("template.uniContractId = :uniContractId", {
              uniContractId: uniContractIds[0],
            });
            qb.orWhere("dropbox.uniContractId = :uniContractId", {
              uniContractId: uniContractIds[0],
            });
          }),
        );
      } else {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where("template.uniContractId IN(:...uniContractIds)", { uniContractIds });
            qb.orWhere("dropbox.uniContractId IN(:...uniContractIds)", { uniContractIds });
          }),
        );
      }
    }

    queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: UniTokenStatus.MINTED });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IUniTokenAutocompleteDto): Promise<Array<UniTokenEntity>> {
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
    where: FindOptionsWhere<UniTokenEntity>,
    options?: FindOneOptions<UniTokenEntity>,
  ): Promise<UniTokenEntity | null> {
    return this.erc998TokenEntityRepository.findOne({ where, ...options });
  }

  public findOnePlus(where: FindOptionsWhere<UniTokenEntity>): Promise<UniTokenEntity | null> {
    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();
    queryBuilder.where(where);

    queryBuilder.leftJoinAndSelect("token.history", "history");
    queryBuilder.leftJoinAndSelect("token.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collection");

    return queryBuilder.getOne();
  }

  public getToken(address: string, tokenId: string): Promise<UniTokenEntity | null> {
    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collection");

    queryBuilder.andWhere("contract.address = :address", {
      address,
    });

    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }
}
