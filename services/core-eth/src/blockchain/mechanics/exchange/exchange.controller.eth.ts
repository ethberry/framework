import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  ExchangeEventType,
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

  @EventPattern([
    { contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Upgrade },
    { contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Mysterybox },
  ])
  public exchange(
    @Payload()
    event: ILogEvent<IExchangeGradeEvent | IExchangeMysteryEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.log(event, context);
  }

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Craft }])
  public craft(
    @Payload()
    event: ILogEvent<IExchangeCraftEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.craft(event, context);
  }

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Claim }])
  public claim(
    @Payload()
    event: ILogEvent<IExchangeClaimEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.claim(event, context);
  }

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Purchase }])
  public purchase(
    @Payload()
    event: ILogEvent<IExchangePurchaseEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.purchase(event, context);
  }
}
