import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeGradeEvent } from "@framework/types";
import { ContractType, ExchangeEventType } from "@framework/types";

import { ExchangeGradeServiceEth } from "./grade.service.eth";

@Controller()
export class ExchangeGradeControllerEth {
  constructor(private readonly exchangeGradeServiceEth: ExchangeGradeServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Upgrade }])
  public exchange(@Payload() event: ILogEvent<IExchangeGradeEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeGradeServiceEth.upgrade(event, context);
  }
}
