import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, IExchangePurchaseEvent } from "@framework/types";

import { ExchangeCoreServiceEth } from "./core.service.eth";

@Controller()
export class ExchangeCoreControllerEth {
  constructor(private readonly exchangeCoreServiceEth: ExchangeCoreServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Purchase }])
  public purchase(@Payload() event: ILogEvent<IExchangePurchaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeCoreServiceEth.purchase(event, context);
  }
}
