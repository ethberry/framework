import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangePurchaseEvent } from "@framework/types";
import { ContractType, ExchangeEventType } from "@framework/types";

import { ExchangeCoreServiceEth } from "./core.service.eth";

@Controller()
export class ExchangeCoreControllerEth {
  constructor(private readonly exchangeCoreServiceEth: ExchangeCoreServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Purchase }])
  public purchase(@Payload() event: ILogEvent<IExchangePurchaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeCoreServiceEth.purchase(event, context);
  }
}
