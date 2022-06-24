import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc998RecipeEventType,
  Erc998RecipeStatus,
  IErc998RecipeCrafted,
  IErc998RecipeCreated,
  IErc998RecipeUpdated,
  TErc998RecipeEventData,
} from "@framework/types";

import { Erc998RecipeService } from "./recipe.service";
import { Erc998RecipeHistoryService } from "./recipe-history/recipe-history.service";
import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";

@Injectable()
export class Erc998RecipeServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly erc998RecipeService: Erc998RecipeService,
    private readonly erc998RecipeHistoryService: Erc998RecipeHistoryService,
  ) {}

  public async create(event: ILogEvent<IErc998RecipeCreated>, context: Log): Promise<void> {
    const {
      args: { recipeId },
    } = event;

    await this.updateHistory(event, context);

    const recipeEntity = await this.erc998RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: Erc998RecipeStatus.ACTIVE,
    });

    await recipeEntity.save();
  }

  public async update(event: ILogEvent<IErc998RecipeUpdated>, context: Log): Promise<void> {
    const {
      args: { recipeId, active },
    } = event;

    await this.updateHistory(event, context);

    const recipeEntity = await this.erc998RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: active ? Erc998RecipeStatus.ACTIVE : Erc998RecipeStatus.INACTIVE,
    });

    await recipeEntity.save();
  }

  public async craft(event: ILogEvent<IErc998RecipeCrafted>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc998RecipeEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc998RecipeServiceEth.name);

    const {
      args,
      args: { recipeId },
      name,
    } = event;

    const { transactionHash, address, blockNumber } = context;

    const recipeEntity = await this.erc998RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      this.loggerService.warn("Suspicious event!");
    }

    await this.erc998RecipeHistoryService.create({
      address,
      transactionHash,
      eventType: name as Erc998RecipeEventType,
      eventData: args,
      erc998RecipeId: recipeEntity ? recipeEntity.id : null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
