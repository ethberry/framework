import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ContractHistoryEntity } from "./contract-history.entity";
import { ContractEventType } from "@framework/types";

@Injectable()
export class ContractHistoryService {
  constructor(
    @InjectRepository(ContractHistoryEntity)
    private readonly contractHistoryService: Repository<ContractHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<ContractHistoryEntity>): Promise<ContractHistoryEntity> {
    return this.contractHistoryService.create(dto).save();
  }

  public async findJson(key: string, value: string): Promise<ContractHistoryEntity | null> {
    const queryBuilder = this.contractHistoryService.createQueryBuilder("history");
    queryBuilder.select();
    queryBuilder.andWhere(`history.event_data->>'${key}' = :${key}`, { [key]: value });
    return await queryBuilder.getOne();
  }

  public async findByRandomRequest(requestId: string): Promise<ContractHistoryEntity | null> {
    const queryBuilder = this.contractHistoryService.createQueryBuilder("history");
    queryBuilder.select();
    queryBuilder.andWhere("history.eventType = :eventType", {
      eventType: ContractEventType.RandomRequest,
    });
    queryBuilder.andWhere(`history.event_data->>'requestId' = :requestId`, { requestId });
    return await queryBuilder.getOne();
  }

  public findOne(
    where: FindOptionsWhere<ContractHistoryEntity>,
    options?: FindOneOptions<ContractHistoryEntity>,
  ): Promise<ContractHistoryEntity | null> {
    return this.contractHistoryService.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<ContractHistoryEntity>,
    dto: DeepPartial<ContractHistoryEntity>,
  ): Promise<ContractHistoryEntity> {
    const { ...rest } = dto;

    const historyEntity = await this.findOne(where);

    if (!historyEntity) {
      throw new NotFoundException("historyNotFound");
    }

    Object.assign(historyEntity, rest);

    return historyEntity.save();
  }
}
