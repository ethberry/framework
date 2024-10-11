import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangePurchaseMysteryBoxEvent } from "@framework/types";
import { ExchangeEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
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
