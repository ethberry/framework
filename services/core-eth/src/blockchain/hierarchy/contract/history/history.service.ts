import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractEventType, TContractEventData } from "@framework/types";

import { ContractHistoryEntity } from "./history.entity";
import { ContractService } from "../contract.service";

@Injectable()
export class ContractHistoryService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ContractHistoryEntity)
    private readonly contractHistoryService: Repository<ContractHistoryEntity>,
    private readonly contractService: ContractService,
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

  public async updateHistory(event: ILogEvent<TContractEventData>, context: Log, tokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), ContractHistoryService.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ContractEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      tokenId: tokenId || null,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));
  }
}
