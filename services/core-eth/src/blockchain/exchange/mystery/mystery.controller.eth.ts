import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, IExchangePurchaseMysteryEvent } from "@framework/types";

import { ExchangeMysteryServiceEth } from "./mystery.service.eth";

@Controller()
export class ExchangeMysteryControllerEth {
  constructor(private readonly exchangeMysteryServiceEth: ExchangeMysteryServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Mysterybox }])
  public mysterybox(@Payload() event: ILogEvent<IExchangePurchaseMysteryEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeMysteryServiceEth.log(event, context);
  }
}
