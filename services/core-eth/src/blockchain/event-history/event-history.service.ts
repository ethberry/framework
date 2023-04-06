import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository, In } from "typeorm";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractEventType,
  ExchangeEventType,
  IERC721TokenMintRandomEvent,
  TContractEventData,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { EventHistoryEntity } from "./event-history.entity";
import { ContractService } from "../hierarchy/contract/contract.service";
import { ChainLinkEventType } from "../integrations/chain-link/log/interfaces";

@Injectable()
export class EventHistoryService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(EventHistoryEntity)
    private readonly contractEventEntityRepository: Repository<EventHistoryEntity>,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
  ) {}

  public async create(dto: DeepPartial<EventHistoryEntity>): Promise<EventHistoryEntity> {
    return this.contractEventEntityRepository.create(dto).save();
  }

  public async findJson(key: string, value: string): Promise<EventHistoryEntity | null> {
    const queryBuilder = this.contractEventEntityRepository.createQueryBuilder("history");
    queryBuilder.select();
    queryBuilder.andWhere(`history.event_data->>'${key}' = :${key}`, { [key]: value });
    return queryBuilder.getOne();
  }

  public async findByRandomRequest(requestId: string): Promise<EventHistoryEntity | null> {
    const queryBuilder = this.contractEventEntityRepository.createQueryBuilder("history");
    queryBuilder.select();
    queryBuilder.andWhere("history.eventType = :eventType", {
      eventType: ChainLinkEventType.RandomWordsRequested,
    });
    queryBuilder.andWhere(`history.event_data->>'requestId' = :requestId`, { requestId });
    return queryBuilder.getOne();
  }

  public findOne(
    where: FindOptionsWhere<EventHistoryEntity>,
    options?: FindOneOptions<EventHistoryEntity>,
  ): Promise<EventHistoryEntity | null> {
    return this.contractEventEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<EventHistoryEntity>,
    options?: FindOneOptions<EventHistoryEntity>,
  ): Promise<Array<EventHistoryEntity>> {
    return this.contractEventEntityRepository.find({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<EventHistoryEntity>,
    dto: DeepPartial<EventHistoryEntity>,
  ): Promise<EventHistoryEntity> {
    const { ...rest } = dto;

    const historyEntity = await this.findOne(where);

    if (!historyEntity) {
      throw new NotFoundException("historyNotFound");
    }

    Object.assign(historyEntity, rest);

    return historyEntity.save();
  }

  public async updateHistory(
    event: ILogEvent<TContractEventData>,
    context: Log,
    tokenId?: number,
    contractId?: number,
  ): Promise<EventHistoryEntity> {
    this.loggerService.log(JSON.stringify(event, null, "\t"), EventHistoryService.name);
    this.loggerService.log(JSON.stringify(context, null, "\t"), EventHistoryService.name);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    if (!contractId) {
      const parentContractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

      if (!parentContractEntity) {
        throw new NotFoundException("contractNotFound");
      }
      contractId = parentContractEntity.id;
    }

    const contractEventEntity = await this.create({
      address,
      transactionHash,
      eventType: name as ContractEventType,
      eventData: args,
      tokenId: tokenId || null,
      contractId,
      chainId,
    });

    // NESTED events
    if ((name as ContractEventType) === "Transfer") {
      const parentEvent = await this.findOne({
        transactionHash,
        eventType: In([
          ExchangeEventType.Purchase,
          ExchangeEventType.Breed,
          ExchangeEventType.Upgrade,
          ExchangeEventType.Craft,
          ExchangeEventType.Mysterybox,
        ]),
      });

      if (parentEvent) {
        Object.assign(contractEventEntity, { parentId: parentEvent.id });
      }
      await contractEventEntity.save();
    }

    // get PARENT events
    await this.findParentHistory(contractEventEntity);

    await this.contractService.updateLastBlockByAddr(address.toLowerCase(), parseInt(blockNumber.toString(), 16));

    return contractEventEntity;
  }

  // get PARENT events
  public async findParentHistory(contractEventEntity: EventHistoryEntity) {
    const { eventType, transactionHash, eventData } = contractEventEntity;

    if (eventType === ContractEventType.RandomWordsRequested) {
      const parentEvent = await this.findOne({
        transactionHash,
        eventType: ContractEventType.Purchase,
      });

      if (parentEvent) {
        Object.assign(contractEventEntity, { parentId: parentEvent.id });
      }
      await contractEventEntity.save();
    }

    if (eventType === ContractEventType.MintRandom) {
      const data = eventData as IERC721TokenMintRandomEvent;
      const requestId = data.requestId;

      const parentEvent = await this.findByRandomRequest(requestId);

      if (parentEvent) {
        Object.assign(contractEventEntity, { parentId: parentEvent.id });
      }
      await contractEventEntity.save();
    }

    if (eventType === ContractEventType.Transfer) {
      const parentEvent = await this.findOne({
        transactionHash,
        eventType: In([
          ExchangeEventType.Purchase,
          ExchangeEventType.Upgrade,
          ExchangeEventType.Breed,
          ExchangeEventType.Craft,
          ExchangeEventType.Mysterybox,
          ExchangeEventType.Claim,
          ExchangeEventType.Lend,
          ContractEventType.MintRandom,
        ]),
      });
      if (parentEvent) {
        Object.assign(contractEventEntity, { parentId: parentEvent.id });

        const nestedEvents = await this.findAll({
          transactionHash,
          parentId: undefined,
        });
        // TODO nested ?== parent
        if (nestedEvents) {
          nestedEvents.map(async nested => {
            if (nested.id !== parentEvent.id) {
              Object.assign(nested, { parentId: parentEvent.id });
              await nested.save();
            }
          });
        }
      }

      await contractEventEntity.save();
    }

    // MODULE:ERC4907 RENT
    if (eventType === ContractEventType.UpdateUser) {
      const parentEvent = await this.findOne({
        transactionHash,
        eventType: In([ExchangeEventType.Lend]),
      });
      if (parentEvent) {
        Object.assign(contractEventEntity, { parentId: parentEvent.id });

        const nestedEvents = await this.findAll({
          transactionHash,
          parentId: undefined,
        });
        // TODO nested ?== parent
        if (nestedEvents) {
          nestedEvents.map(async nested => {
            if (nested.id !== parentEvent.id) {
              Object.assign(nested, { parentId: parentEvent.id });
              await nested.save();
            }
          });
        }
      }

      await contractEventEntity.save();
    }
  }
}
