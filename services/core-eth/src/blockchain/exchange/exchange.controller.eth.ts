import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  ExchangeEventType,
  IExchangeBreedEvent,
  IExchangeClaimEvent,
  IExchangeCraftEvent,
  IExchangeGradeEvent,
  IExchangeMysteryEvent,
  IExchangePurchaseEvent,
} from "@framework/types";

import { ExchangeServiceEth } from "./exchange.service.eth";

@Controller()
export class ExchangeControllerEth {
  constructor(private readonly exchangeServiceEth: ExchangeServiceEth) {}

  // MODULE:CORE
  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Purchase }])
  public purchase(@Payload() event: ILogEvent<IExchangePurchaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.purchase(event, context);
  }

  // MODULE:GRADE
  // MODULE:MYSTERY
  @EventPattern([
    { contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Upgrade },
    { contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Mysterybox },
  ])
  public exchange(
    @Payload() event: ILogEvent<IExchangeGradeEvent | IExchangeMysteryEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.log(event, context);
  }

  // MODULE:CRAFT
  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Craft }])
  public craft(@Payload() event: ILogEvent<IExchangeCraftEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.craft(event, context);
  }

  // MODULE:CLAIM
  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Claim }])
  public claim(@Payload() event: ILogEvent<IExchangeClaimEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.claim(event, context);
  }

  // MODULE:BREEDING
  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Breed }])
  public breed(@Payload() event: ILogEvent<IExchangeBreedEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.breed(event, context);
  }
}
