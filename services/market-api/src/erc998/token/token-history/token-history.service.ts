import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998TokenEventType, IUniTokenApprovedForAll, IUniTokenHistorySearchDto } from "@framework/types";

import { Erc998TokenHistoryEntity } from "./token-history.entity";
import { UserEntity } from "../../../user/user.entity";

@Injectable()
export class Erc998TokenHistoryService {
  constructor(
    @InjectRepository(Erc998TokenHistoryEntity)
    private readonly erc998TokenHistoryEntityRepository: Repository<Erc998TokenHistoryEntity>,
  ) {}

  public async search(dto: IUniTokenHistorySearchDto): Promise<[Array<Erc998TokenHistoryEntity>, number]> {
    const { erc998TokenId, collection, tokenId, take, skip } = dto;
    const queryBuilder = this.erc998TokenHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    if (erc998TokenId) {
      queryBuilder.andWhere("history.erc998TokenId = :erc998TokenId", { erc998TokenId });
    } else {
      queryBuilder.andWhere("history.address = :address", { address: collection });
      queryBuilder.andWhere("history.event_data->>'tokenId' = :tokenId", { tokenId });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<Erc998TokenHistoryEntity>,
    options?: FindOneOptions<Erc998TokenHistoryEntity>,
  ): Promise<Erc998TokenHistoryEntity | null> {
    return this.erc998TokenHistoryEntityRepository.findOne({ where, ...options });
  }

  public async getApprove(userEntity: UserEntity, contract: string): Promise<boolean> {
    const wallet = userEntity.wallet;
    const queryBuilder = this.erc998TokenHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();
    queryBuilder.where({ address: contract, eventType: Erc998TokenEventType.ApprovalForAll });

    queryBuilder.andWhere("history.event_data->>'account' = :wallet", { wallet });
    queryBuilder.addOrderBy("history.updatedAt", "DESC");
    const historyEntity = await queryBuilder.getOne();

    if (!historyEntity) {
      return false;
    }

    return (historyEntity.eventData as IUniTokenApprovedForAll).approved;
  }
}
