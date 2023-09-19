import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangePurchaseLotteryEvent } from "@framework/types";
import { ContractType, ExchangeEventType } from "@framework/types";

import { ExchangeLotteryServiceEth } from "./lottery.service.eth";

@Controller()
export class ExchangeLotteryControllerEth {
  constructor(private readonly exchangeLotteryServiceEth: ExchangeLotteryServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.PurchaseLottery }])
  public purchase(@Payload() event: ILogEvent<IExchangePurchaseLotteryEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeLotteryServiceEth.purchaseLottery(event, context);
  }
}
