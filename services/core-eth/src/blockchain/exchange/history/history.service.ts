import { Injectable, LoggerService, Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ExchangeEventType, TExchangeEventData } from "@framework/types";

import { ExchangeHistoryEntity } from "./history.entity";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class ExchangeHistoryService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ExchangeHistoryEntity)
    private readonly exchangeHistoryEntity: Repository<ExchangeHistoryEntity>,
    private readonly contractService: ContractService,
  ) {}

  public async create(dto: DeepPartial<ExchangeHistoryEntity>): Promise<ExchangeHistoryEntity> {
    return this.exchangeHistoryEntity.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<ExchangeHistoryEntity>,
    options?: FindOneOptions<ExchangeHistoryEntity>,
  ): Promise<ExchangeHistoryEntity | null> {
    return this.exchangeHistoryEntity.findOne({ where, ...options });
  }

  public async updateHistory(event: ILogEvent<TExchangeEventData>, context: Log): Promise<ExchangeHistoryEntity> {
    this.loggerService.log(JSON.stringify(event, null, "\t"), ExchangeHistoryService.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    const exchangeHistoryEntity = await this.create({
      address,
      transactionHash,
      eventType: name as ExchangeEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));

    return exchangeHistoryEntity;
  }
}
