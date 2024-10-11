import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangeRentableEvent } from "@framework/types";
import { ExchangeEventType } from "@framework/types";

import { ExchangeRentServiceEth } from "./rent.service.eth";
import { ContractType } from "../../../utils/contract-type";

@Controller()
export class ExchangeRentControllerEth {
  constructor(private readonly exchangeRentServiceEth: ExchangeRentServiceEth) {}

  @EventPattern({ contractType: ContractType.RENTABLE, eventName: ExchangeEventType.Lend })
  public lend(@Payload() event: ILogEvent<IExchangeRentableEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeRentServiceEth.lend(event, context);
  }

  @EventPattern({ contractType: ContractType.RENTABLE, eventName: ExchangeEventType.LendMany })
  public lendMany(@Payload() event: ILogEvent<IExchangeRentableEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeRentServiceEth.lendMany(event, context);
  }
}
