import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  ExchangeEventType,
  IErc721RecipeCrafted,
  IErc721RecipeCreated,
  IErc721RecipeUpdated,
} from "@framework/types";

import { ExchangeRulesServiceEth } from "./exchange-rules.service.eth";

@Controller()
export class ExchangeRulesControllerEth {
  constructor(private readonly erc1155RecipeServiceEth: ExchangeRulesServiceEth) {}

  @EventPattern({ contractType: ContractType.ERC1155_CRAFT, eventName: ExchangeEventType.RecipeCreated })
  public createRecipe(@Payload() event: ILogEvent<IErc721RecipeCreated>, @Ctx() context: Log): Promise<void> {
    return this.erc1155RecipeServiceEth.create(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_CRAFT, eventName: ExchangeEventType.RecipeUpdated })
  public updateRecipe(@Payload() event: ILogEvent<IErc721RecipeUpdated>, @Ctx() context: Log): Promise<void> {
    return this.erc1155RecipeServiceEth.update(event, context);
  }

  @EventPattern({ contractType: ContractType.ERC1155_CRAFT, eventName: ExchangeEventType.RecipeCrafted })
  public craftRecipe(@Payload() event: ILogEvent<IErc721RecipeCrafted>, @Ctx() context: Log): Promise<void> {
    return this.erc1155RecipeServiceEth.craft(event, context);
  }
}
