import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ContractEventType, IErc1155TokenApprovalForAllEvent, IContractHistorySearchDto } from "@framework/types";

import { ContractHistoryEntity } from "./contract-history.entity";
import { UserEntity } from "../../user/user.entity";

@Injectable()
export class ContractHistoryService {
  constructor(
    @InjectRepository(ContractHistoryEntity)
    private readonly contractHistoryEntityRepository: Repository<ContractHistoryEntity>,
  ) {}

  public async search(dto: IContractHistorySearchDto): Promise<[Array<ContractHistoryEntity>, number]> {
    const { address, tokenId, take, skip } = dto;
    const queryBuilder = this.contractHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.andWhere("history.address = :address", { address });
    queryBuilder.andWhere("history.event_data->>'tokenId' = :tokenId", { tokenId });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ContractHistoryEntity>,
    options?: FindOneOptions<ContractHistoryEntity>,
  ): Promise<ContractHistoryEntity | null> {
    return this.contractHistoryEntityRepository.findOne({ where, ...options });
  }

  public async getApprove(userEntity: UserEntity, contract: string): Promise<boolean> {
    const account = userEntity.wallet;
    const queryBuilder = this.contractHistoryEntityRepository.createQueryBuilder("history");

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
