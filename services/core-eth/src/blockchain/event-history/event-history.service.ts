import { forwardRef, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  ChainLinkEventType,
  Erc1155EventType,
  Erc20EventType,
  RentableEventType,
  Erc721EventType,
  ExchangeEventType,
  IERC721TokenMintRandomEvent,
  ReferralProgramEventType,
  StakingEventType,
  TContractEventData,
  type TContractEventType,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { AchievementsRuleService } from "../mechanics/meta/achievements/rule/rule.service";
import { ContractService } from "../hierarchy/contract/contract.service";
import { EventHistoryEntity } from "./event-history.entity";

@Injectable()
export class EventHistoryService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(EventHistoryEntity)
    private readonly contractEventEntityRepository: Repository<EventHistoryEntity>,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AchievementsRuleService))
    private readonly achievementsRuleService: AchievementsRuleService,
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

  public findOneWithRelations(where: FindOptionsWhere<EventHistoryEntity>): Promise<EventHistoryEntity | null> {
    const queryBuilder = this.contractEventEntityRepository.createQueryBuilder("event");
    queryBuilder.leftJoinAndSelect("event.token", "token");
    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.leftJoinAndSelect("event.parent", "parent");
    queryBuilder.leftJoinAndSelect("parent.parent", "grand_parent");
    queryBuilder.leftJoinAndSelect("grand_parent.parent", "grand_grand_parent");
    queryBuilder.leftJoinAndSelect("grand_grand_parent.token", "exchange_event");

    queryBuilder.andWhere("event.id = :id", {
      id: where.id,
    });

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
    options?: FindManyOptions<EventHistoryEntity>,
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
  ): Promise<EventHistoryEntity> {
    this.loggerService.log(JSON.stringify(event, null, "\t"), EventHistoryService.name);
    this.loggerService.log(JSON.stringify(context, null, "\t"), EventHistoryService.name);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const { args, name } = event;
    const { transactionHash, address } = context;

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase(), chainId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const contractEventEntity = await this.create({
      address,
      transactionHash,
      eventType: name as TContractEventType,
      eventData: args,
      tokenId: tokenId || null,
      contractId: contractEntity.id,
      chainId,
    });

    await this.findParentHistory(contractEventEntity);

    await this.achievementsRuleService.processEvent(contractEventEntity.id);

    return contractEventEntity;
  }

  // get PARENT events
  public async findParentHistory(contractEventEntity: EventHistoryEntity) {
    const { id, eventType, transactionHash, eventData } = contractEventEntity;

    // RANDOM
    if (eventType === ChainLinkEventType.RandomWordsRequested) {
      const parentEvent = await this.findOne({
        transactionHash,
        eventType: In([
          ExchangeEventType.Purchase,
          ExchangeEventType.Breed,
          ExchangeEventType.Craft,
          ExchangeEventType.PurchaseMysteryBox,
          ExchangeEventType.Claim,
        ]),
      });

      if (parentEvent) {
        Object.assign(contractEventEntity, { parentId: parentEvent.id });
        await contractEventEntity.save();
        await this.findNestedHistory(transactionHash, parentEvent.id);
      }
    }

    if (eventType === ChainLinkEventType.MintRandom) {
      const data = eventData as IERC721TokenMintRandomEvent;
      const requestId = data.requestId;
      const parentEvent = await this.findByRandomRequest(requestId.toString());

      if (parentEvent) {
        Object.assign(contractEventEntity, { parentId: parentEvent.id });
        await contractEventEntity.save();
        await this.findNestedHistory(transactionHash, parentEvent.id);
      }
    }

    // TRANSFER
    if (
      eventType === Erc20EventType.Transfer ||
      eventType === Erc721EventType.Transfer ||
      eventType === Erc1155EventType.TransferSingle ||
      eventType === Erc1155EventType.TransferBatch ||
      eventType === ReferralProgramEventType.ReferralEvent
    ) {
      const parentEvent = await this.findOne({
        transactionHash,
        eventType: In([
          ExchangeEventType.Purchase,
          ExchangeEventType.Upgrade,
          ExchangeEventType.Breed,
          ExchangeEventType.Craft,
          ExchangeEventType.Dismantle,
          ExchangeEventType.PurchaseMysteryBox,
          ExchangeEventType.Claim,
          ExchangeEventType.Lend,
          ExchangeEventType.PurchaseLottery,
          ExchangeEventType.PurchaseRaffle,
          ChainLinkEventType.MintRandom,
          StakingEventType.DepositStart,
          StakingEventType.DepositFinish,
        ]),
      });
      if (parentEvent) {
        Object.assign(contractEventEntity, { parentId: parentEvent.id });
        await contractEventEntity.save();
        await this.findNestedHistory(transactionHash, parentEvent.id);
      }

      await contractEventEntity.save();
    }

    // MODULE:RENTABLE
    if (eventType === RentableEventType.UpdateUser) {
      const parentEvent = await this.findOne({
        transactionHash,
        eventType: In([ExchangeEventType.Lend]),
      });
      if (parentEvent) {
        Object.assign(contractEventEntity, { parentId: parentEvent.id });
        await contractEventEntity.save();
        await this.findNestedHistory(transactionHash, parentEvent.id);
      }

      await contractEventEntity.save();
    }

    // ANY EXCHANGE EVENT
    if (Object.values<string>(ExchangeEventType).includes(eventType)) {
      await this.findNestedHistory(transactionHash, id);
    }
  }

  // get NESTED events
  public async findNestedHistory(transactionHash: string, parentId: number) {
    const nestedEvents = await this.findAll({
      transactionHash,
      parentId: undefined,
    });

    if (nestedEvents) {
      await Promise.allSettled(
        nestedEvents.map(async nested => {
          if (nested.id !== parentId) {
            Object.assign(nested, { parentId });
            await nested.save();
          }
        }),
      ).then(res => {
        res.forEach(value => {
          if (value.status === "rejected") {
            this.loggerService.error(value.reason, EventHistoryService.name);
          }
        });
      });
    }
  }
}
