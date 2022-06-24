import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  Erc998RecipeEventType,
  IErc998RecipeCrafted,
  IErc998RecipeCreated,
  IErc998RecipeUpdated,
} from "@framework/types";

import { Erc998RecipeServiceEth } from "./recipe.service.eth";

@Controller()
export class Erc998ControllerEth {
  constructor(private readonly erc998RecipeServiceEth: Erc998RecipeServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC998_CRAFT, eventName: Erc998RecipeEventType.RecipeCreated })
  public createRecipe(@Payload() event: ILogEvent<IErc998RecipeCreated>, @Ctx() context: Log): Promise<void> {
    return this.erc998RecipeServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_CRAFT, eventName: Erc998RecipeEventType.RecipeUpdated })
  public updateRecipe(@Payload() event: ILogEvent<IErc998RecipeUpdated>, @Ctx() context: Log): Promise<void> {
    return this.erc998RecipeServiceEth.update(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC998_CRAFT, eventName: Erc998RecipeEventType.RecipeCrafted })
  public craftRecipe(@Payload() event: ILogEvent<IErc998RecipeCrafted>, @Ctx() context: Log): Promise<void> {
    return this.erc998RecipeServiceEth.craft(event, context);
  }
}
