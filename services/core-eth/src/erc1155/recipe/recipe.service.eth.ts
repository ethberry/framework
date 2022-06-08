import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc1155RecipeEventType,
  Erc1155RecipeStatus,
  IErc1155RecipeCrafted,
  IErc1155RecipeCreated,
  IErc1155RecipeUpdated,
  TErc1155RecipeEventData,
} from "@framework/types";

import { ContractManagerService } from "../../blockchain/contract-manager/contract-manager.service";
import { Erc1155RecipeService } from "./recipe.service";
import { Erc1155RecipeHistoryService } from "./recipe-history/recipe-history.service";

@Injectable()
export class Erc1155RecipeServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerService: ContractManagerService,
    private readonly erc1155RecipeService: Erc1155RecipeService,
    private readonly erc1155RecipeHistoryService: Erc1155RecipeHistoryService,
  ) {}

  public async create(event: ILogEvent<IErc1155RecipeCreated>, context: Log): Promise<void> {
    const {
      args: { recipeId },
    } = event;

    await this.updateHistory(event, context);

    const recipeEntity = await this.erc1155RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: Erc1155RecipeStatus.ACTIVE,
    });

    await recipeEntity.save();
  }

  public async update(event: ILogEvent<IErc1155RecipeUpdated>, context: Log): Promise<void> {
    const {
      args: { recipeId, active },
    } = event;

    await this.updateHistory(event, context);

    const recipeEntity = await this.erc1155RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: active ? Erc1155RecipeStatus.ACTIVE : Erc1155RecipeStatus.INACTIVE,
    });

    await recipeEntity.save();
  }

  public async craft(event: ILogEvent<IErc1155RecipeCrafted>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TErc1155RecipeEventData>, context: Log) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc1155RecipeServiceEth.name);

    const {
      args,
      args: { recipeId },
      name,
    } = event;

    const { transactionHash, address, blockNumber } = context;

    const recipeEntity = await this.erc1155RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      this.loggerService.warn("Suspicious event!");
    }

    await this.erc1155RecipeHistoryService.create({
      address,
      transactionHash,
      eventType: name as Erc1155RecipeEventType,
      eventData: args,
      erc1155RecipeId: recipeEntity ? recipeEntity.id : null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
