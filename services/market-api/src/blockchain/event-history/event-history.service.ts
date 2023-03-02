import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ContractEventType, IContractHistorySearchDto, IErc1155TokenApprovalForAllEvent } from "@framework/types";

import { EventHistoryEntity } from "./event-history.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";

@Injectable()
export class EventHistoryService {
  constructor(
    @InjectRepository(EventHistoryEntity)
    private readonly EventHistoryEntityRepository: Repository<EventHistoryEntity>,
  ) {}

  public async search(dto: IContractHistorySearchDto): Promise<[Array<EventHistoryEntity>, number]> {
    const { address, tokenId, take, skip } = dto;
    const queryBuilder = this.EventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.andWhere("history.address = :address", { address });
    queryBuilder.andWhere("history.event_data->>'tokenId' = :tokenId", { tokenId });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<EventHistoryEntity>,
    options?: FindOneOptions<EventHistoryEntity>,
  ): Promise<EventHistoryEntity | null> {
    return this.EventHistoryEntityRepository.findOne({ where, ...options });
  }

  public async getApprove(userEntity: UserEntity, contract: string): Promise<boolean> {
    const account = userEntity.wallet;
    const queryBuilder = this.EventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();
    queryBuilder.where({ address: contract, eventType: ContractEventType.ApprovalForAll });

    queryBuilder.andWhere("history.event_data->>'account' = :account", { account });
    queryBuilder.addOrderBy("history.updatedAt", "DESC");
    const historyEntity = await queryBuilder.getOne();

    if (!historyEntity) {
      return false;
    }

    return (historyEntity.eventData as IErc1155TokenApprovalForAllEvent).approved;
  }
}
