import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  Erc721RecipeEventType,
  IErc721RecipeCrafted,
  IErc721RecipeCreated,
  IErc721RecipeUpdated,
} from "@framework/types";

import { Erc721RecipeServiceEth } from "./recipe.service.eth";

@Controller()
export class Erc721ControllerEth {
  constructor(private readonly erc721RecipeServiceEth: Erc721RecipeServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC721_CRAFT, eventName: Erc721RecipeEventType.RecipeCreated })
  public createRecipe(@Payload() event: ILogEvent<IErc721RecipeCreated>, @Ctx() context: Log): Promise<void> {
    return this.erc721RecipeServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_CRAFT, eventName: Erc721RecipeEventType.RecipeUpdated })
  public updateRecipe(@Payload() event: ILogEvent<IErc721RecipeUpdated>, @Ctx() context: Log): Promise<void> {
    return this.erc721RecipeServiceEth.update(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC721_CRAFT, eventName: Erc721RecipeEventType.RecipeCrafted })
  public craftRecipe(@Payload() event: ILogEvent<IErc721RecipeCrafted>, @Ctx() context: Log): Promise<void> {
    return this.erc721RecipeServiceEth.craft(event, context);
  }
}
