import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc721RecipeEventType,
  IErc721RecipeCrafted,
  IErc721RecipeCreated,
  IErc721RecipeUpdated,
} from "@framework/types";

import { ContractType } from "../../common/interfaces";
import { Erc721RecipeServiceWs } from "./recipe.service.ws";

@Controller()
export class Erc721ControllerWs {
  constructor(private readonly erc721RecipeServiceWs: Erc721RecipeServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC721_CRAFT, eventName: Erc721RecipeEventType.RecipeCreated })
  public createRecipe(@Payload() event: IEvent<IErc721RecipeCreated>): Promise<void> {
    return this.erc721RecipeServiceWs.create(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_CRAFT, eventName: Erc721RecipeEventType.RecipeUpdated })
  public updateRecipe(@Payload() event: IEvent<IErc721RecipeUpdated>): Promise<void> {
    return this.erc721RecipeServiceWs.update(event);
  }

  @EventPattern({ contractName: ContractType.ERC721_CRAFT, eventName: Erc721RecipeEventType.RecipeCrafted })
  public craftRecipe(@Payload() event: IEvent<IErc721RecipeCrafted>): Promise<void> {
    return this.erc721RecipeServiceWs.craft(event);
  }
}
