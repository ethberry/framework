import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ContractType, ExchangeEventType } from "@framework/types";
import type { IExchangePurchaseRaffleEvent } from "@framework/types";

import { ExchangeRaffleServiceEth } from "./raffle.service.eth";

@Controller()
export class ExchangeRaffleControllerEth {
  constructor(private readonly exchangeRaffleServiceEth: ExchangeRaffleServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.PurchaseRaffle }])
  public purchaseRaffle(@Payload() event: ILogEvent<IExchangePurchaseRaffleEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeRaffleServiceEth.purchaseRaffle(event, context);
  }
}
