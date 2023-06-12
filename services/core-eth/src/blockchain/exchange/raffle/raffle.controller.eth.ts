import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, IExchangePurchaseRaffleEvent } from "@framework/types";

import { ExchangeRaffleServiceEth } from "./raffle.service.eth";

@Controller()
export class ExchangeRaffleControllerEth {
  constructor(private readonly exchangeRaffleServiceEth: ExchangeRaffleServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.PurchaseRaffle }])
  public purchase(@Payload() event: ILogEvent<IExchangePurchaseRaffleEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeRaffleServiceEth.purchaseRaffle(event, context);
  }
}
