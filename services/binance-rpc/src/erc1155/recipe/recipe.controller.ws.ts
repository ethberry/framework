import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import {
  Erc1155RecipeEventType,
  IErc1155RecipeCrafted,
  IErc1155RecipeCreated,
  IErc1155RecipeUpdated,
} from "@framework/types";

import { ContractType } from "../../common/interfaces";
import { Erc1155RecipeServiceWs } from "./recipe.service.ws";

@Controller()
export class Erc1155ControllerWs {
  constructor(private readonly erc1155RecipeServiceWs: Erc1155RecipeServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC1155_CRAFT, eventName: Erc1155RecipeEventType.RecipeCreated })
  public createRecipe(@Payload() event: IEvent<IErc1155RecipeCreated>): Promise<void> {
    return this.erc1155RecipeServiceWs.create(event);
  }

  @EventPattern({ contractName: ContractType.ERC1155_CRAFT, eventName: Erc1155RecipeEventType.RecipeUpdated })
  public updateRecipe(@Payload() event: IEvent<IErc1155RecipeUpdated>): Promise<void> {
    return this.erc1155RecipeServiceWs.update(event);
  }

  @EventPattern({ contractName: ContractType.ERC1155_CRAFT, eventName: Erc1155RecipeEventType.RecipeCrafted })
  public craftRecipe(@Payload() event: IEvent<IErc1155RecipeCrafted>): Promise<void> {
    return this.erc1155RecipeServiceWs.craft(event);
  }
}
