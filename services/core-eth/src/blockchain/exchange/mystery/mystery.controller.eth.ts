import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, IExchangePurchaseMysteryBoxEvent } from "@framework/types";

import { ExchangeMysteryServiceEth } from "./mystery.service.eth";

@Controller()
export class ExchangeMysteryControllerEth {
  constructor(private readonly exchangeMysteryServiceEth: ExchangeMysteryServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.PurchaseMysteryBox }])
  public purchaseMystery(
    @Payload() event: ILogEvent<IExchangePurchaseMysteryBoxEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeMysteryServiceEth.log(event, context);
  }
}
