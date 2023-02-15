import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, IExchangeGradeEvent } from "@framework/types";

import { ExchangeGradeServiceEth } from "./grade.service.eth";

@Controller()
export class ExchangeGradeControllerEth {
  constructor(private readonly exchangeGradeServiceEth: ExchangeGradeServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Upgrade }])
  public exchange(@Payload() event: ILogEvent<IExchangeGradeEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeGradeServiceEth.upgrade(event, context);
  }
}
