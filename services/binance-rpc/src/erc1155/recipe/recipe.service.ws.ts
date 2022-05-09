import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc1155RecipeEventType,
  IErc1155RecipeCrafted,
  IErc1155RecipeCreated,
  IErc1155RecipeUpdated,
  RecipeStatus,
  TErc1155RecipeEventData,
} from "@framework/types";

import { Erc1155RecipeService } from "./recipe.service";
import { Erc1155RecipeHistoryService } from "../recipe-history/recipe-history.service";

@Injectable()
export class Erc1155RecipeServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc1155RecipeService: Erc1155RecipeService,
    private readonly erc1155RecipeHistoryService: Erc1155RecipeHistoryService,
  ) {}

  public async create(event: IEvent<IErc1155RecipeCreated>): Promise<void> {
    const {
      returnValues: { recipeId },
    } = event;

    await this.updateHistory(event);

    const recipeEntity = await this.erc1155RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: RecipeStatus.ACTIVE,
    });

    await recipeEntity.save();
  }

  public async update(event: IEvent<IErc1155RecipeUpdated>): Promise<void> {
    const {
      returnValues: { recipeId, active },
    } = event;

    await this.updateHistory(event);

    const recipeEntity = await this.erc1155RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: active ? RecipeStatus.ACTIVE : RecipeStatus.INACTIVE,
    });

    await recipeEntity.save();
  }

  public async craft(event: IEvent<IErc1155RecipeCrafted>): Promise<void> {
    await this.updateHistory(event);
  }

  private async updateHistory(event: IEvent<TErc1155RecipeEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc1155RecipeServiceWs.name);

    const {
      returnValues,
      returnValues: { recipeId },
      event: eventType,
      transactionHash,
      address,
    } = event;

    const recipeEntity = await this.erc1155RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      this.loggerService.warn("Suspicious event!");
    }

    await this.erc1155RecipeHistoryService.create({
      address,
      transactionHash,
      eventType: eventType as Erc1155RecipeEventType,
      eventData: returnValues,
      erc1155RecipeId: recipeEntity ? recipeEntity.id : null,
    });
  }
}
