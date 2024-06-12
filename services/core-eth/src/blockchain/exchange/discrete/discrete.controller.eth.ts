import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeDiscreteEvent } from "@framework/types";
import { ContractType, ExchangeEventType } from "@framework/types";

import { ExchangeDiscreteServiceEth } from "./discrete.service.eth";

@Controller()
export class ExchangeGradeControllerEth {
  constructor(private readonly exchangeDiscreteServiceEth: ExchangeDiscreteServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Upgrade }])
  public exchange(@Payload() event: ILogEvent<IExchangeDiscreteEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeDiscreteServiceEth.upgrade(event, context);
  }
}
