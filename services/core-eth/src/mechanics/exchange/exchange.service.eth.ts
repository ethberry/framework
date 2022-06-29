import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ExchangeEventType,
  ExchangeStatus,
  IErc721RecipeCrafted,
  IErc721RecipeCreated,
  IErc721RecipeUpdated,
  TExchangeEventData,
} from "@framework/types";

import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { ExchangeService } from "./exchange.service";
import { ExchangeHistoryService } from "./exchange-history/exchange-history.service";

@Injectable()
export class ExchangeServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly exchangeService: ExchangeService,
    private readonly erc1155RecipeHistoryService: ExchangeHistoryService,
  ) {}

  public async create(event: ILogEvent<IErc721RecipeCreated>, context: Log): Promise<void> {
    const {
      args: { recipeId },
    } = event;

    await this.updateHistory(event, context);

    const recipeEntity = await this.exchangeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      exchangeStatus: ExchangeStatus.ACTIVE,
    });

    await recipeEntity.save();
  }

  public async update(event: ILogEvent<IErc721RecipeUpdated>, context: Log): Promise<void> {
    const {
      args: { recipeId, active },
    } = event;

    await this.updateHistory(event, context);

    const recipeEntity = await this.exchangeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      exchangeStatus: active ? ExchangeStatus.ACTIVE : ExchangeStatus.INACTIVE,
    });

    await recipeEntity.save();
  }

  public async craft(event: ILogEvent<IErc721RecipeCrafted>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TExchangeEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), ExchangeServiceEth.name);

    const {
      args,
      args: { recipeId },
      name,
    } = event;

    const { transactionHash, address, blockNumber } = context;

    const recipeEntity = await this.exchangeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      this.loggerService.warn("Suspicious event!");
    }

    await this.erc1155RecipeHistoryService.create({
      address,
      transactionHash,
      eventType: name as ExchangeEventType,
      eventData: args,
      exchangeId: recipeEntity ? recipeEntity.id : null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
