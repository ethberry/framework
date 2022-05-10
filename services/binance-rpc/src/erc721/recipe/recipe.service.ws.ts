import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc721RecipeEventType,
  Erc721RecipeStatus,
  IErc721RecipeCrafted,
  IErc721RecipeCreated,
  IErc721RecipeUpdated,
  TErc721RecipeEventData,
} from "@framework/types";

import { Erc721RecipeService } from "./recipe.service";
import { Erc721RecipeHistoryService } from "../recipe-history/recipe-history.service";

@Injectable()
export class Erc721RecipeServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly erc721RecipeService: Erc721RecipeService,
    private readonly erc721RecipeHistoryService: Erc721RecipeHistoryService,
  ) {}

  public async create(event: IEvent<IErc721RecipeCreated>): Promise<void> {
    const {
      returnValues: { recipeId },
    } = event;

    await this.updateHistory(event);

    const recipeEntity = await this.erc721RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: Erc721RecipeStatus.ACTIVE,
    });

    await recipeEntity.save();
  }

  public async update(event: IEvent<IErc721RecipeUpdated>): Promise<void> {
    const {
      returnValues: { recipeId, active },
    } = event;

    await this.updateHistory(event);

    const recipeEntity = await this.erc721RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      throw new NotFoundException("recipeNotFound");
    }

    Object.assign(recipeEntity, {
      recipeStatus: active ? Erc721RecipeStatus.ACTIVE : Erc721RecipeStatus.INACTIVE,
    });

    await recipeEntity.save();
  }

  public async craft(event: IEvent<IErc721RecipeCrafted>): Promise<void> {
    await this.updateHistory(event);
  }

  private async updateHistory(event: IEvent<TErc721RecipeEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc721RecipeServiceWs.name);

    const {
      returnValues,
      returnValues: { recipeId },
      event: eventType,
      transactionHash,
      address,
    } = event;

    const recipeEntity = await this.erc721RecipeService.findOne({ id: +recipeId });

    if (!recipeEntity) {
      this.loggerService.warn("Suspicious event!");
    }

    await this.erc721RecipeHistoryService.create({
      address,
      transactionHash,
      eventType: eventType as Erc721RecipeEventType,
      eventData: returnValues,
      erc721RecipeId: recipeEntity ? recipeEntity.id : null,
    });
  }
}
