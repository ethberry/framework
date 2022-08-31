import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  ExchangeEventType,
  IExchangeClaim,
  IExchangeCraft,
  IExchangeGrade,
  IExchangeMysterybox,
  IExchangePurchase,
} from "@framework/types";

import { ExchangeServiceEth } from "./exchange.service.eth";

@Controller()
export class ExchangeControllerEth {
  constructor(private readonly exchangeServiceEth: ExchangeServiceEth) {}

  @EventPattern([
    { contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Upgrade },
    { contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Mysterybox },
    { contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Upgrade },
  ])
  public exchange(
    @Payload()
    event: ILogEvent<IExchangeGrade | IExchangeMysterybox>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.log(event, context);
  }

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Craft }])
  public craft(
    @Payload()
    event: ILogEvent<IExchangeCraft>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.logCraft(event, context);
  }

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Claim }])
  public claim(
    @Payload()
    event: ILogEvent<IExchangeClaim>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.claim(event, context);
  }

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Purchase }])
  public purchase(
    @Payload()
    event: ILogEvent<IExchangePurchase>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.purchase(event, context);
  }
}
