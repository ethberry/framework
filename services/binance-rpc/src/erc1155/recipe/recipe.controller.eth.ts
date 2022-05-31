import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  Erc1155RecipeEventType,
  IErc1155RecipeCrafted,
  IErc1155RecipeCreated,
  IErc1155RecipeUpdated,
  ContractType,
} from "@framework/types";

import { Erc1155RecipeServiceEth } from "./recipe.service.eth";

@Controller()
export class Erc1155ControllerEth {
  constructor(private readonly erc1155RecipeServiceEth: Erc1155RecipeServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC1155_CRAFT, eventName: Erc1155RecipeEventType.RecipeCreated })
  public createRecipe(@Payload() event: ILogEvent<IErc1155RecipeCreated>, @Ctx() context: Log): Promise<void> {
    return this.erc1155RecipeServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_CRAFT, eventName: Erc1155RecipeEventType.RecipeUpdated })
  public updateRecipe(@Payload() event: ILogEvent<IErc1155RecipeUpdated>, @Ctx() context: Log): Promise<void> {
    return this.erc1155RecipeServiceEth.update(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_CRAFT, eventName: Erc1155RecipeEventType.RecipeCrafted })
  public craftRecipe(@Payload() event: ILogEvent<IErc1155RecipeCrafted>, @Ctx() context: Log): Promise<void> {
    return this.erc1155RecipeServiceEth.craft(event, context);
  }
}
