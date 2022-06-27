import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc721RecipeEventType,
  ExchangeStatus,
  IErc721RecipeCrafted,
  IErc721RecipeCreated,
  IErc721RecipeUpdated,
  TErc721RecipeEventData,
} from "@framework/types";

import { Erc721RecipeService } from "./recipe.service";
import { Erc721RecipeHistoryService } from "./recipe-history/recipe-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc721RecipeServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly erc721RecipeService: Erc721RecipeService,
    private readonly erc721RecipeHistoryService: Erc721RecipeHistoryService,
  ) {}

  public async create(event: ILogEvent<IErc721RecipeCreated>, context: Log): Promise<void> {
    const {
      args: { recipeId },
    } = event;

    await this.updateHistory(event, context);

    const recipeEntity = await this.erc721RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: ExchangeStatus.ACTIVE,
    });

    await recipeEntity.save();
  }

  public async update(event: ILogEvent<IErc721RecipeUpdated>, context: Log): Promise<void> {
    const {
      args: { recipeId, active },
    } = event;

    await this.updateHistory(event, context);

    const recipeEntity = await this.erc721RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: active ? ExchangeStatus.ACTIVE : ExchangeStatus.INACTIVE,
    });

    await recipeEntity.save();
  }

  public async craft(event: ILogEvent<IErc721RecipeCrafted>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc721RecipeEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc721RecipeServiceEth.name);

    const {
      args,
      args: { recipeId },
      name,
    } = event;

    const { transactionHash, address, blockNumber } = context;

    const recipeEntity = await this.erc721RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      this.loggerService.warn("Suspicious event!");
    }

    await this.erc721RecipeHistoryService.create({
      address,
      transactionHash,
      eventType: name as Erc721RecipeEventType,
      eventData: args,
      erc721RecipeId: recipeEntity ? recipeEntity.id : null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
