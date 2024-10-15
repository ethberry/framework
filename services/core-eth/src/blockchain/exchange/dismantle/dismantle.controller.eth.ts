import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangeDismantleEvent } from "@framework/types";
import { ExchangeEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ExchangeDismantleServiceEth } from "./dismantle.service.eth";

@Controller()
export class ExchangeDismantleControllerEth {
  constructor(private readonly exchangeDismantleServiceEth: ExchangeDismantleServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Dismantle }])
  public dismantle(@Payload() event: ILogEvent<IExchangeDismantleEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeDismantleServiceEth.dismantle(event, context);
  }
}
