import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, IExchangeLendEvent } from "@framework/types";

import { ExchangeRentServiceEth } from "./rent.service.eth";

@Controller()
export class ExchangeRentControllerEth {
  constructor(private readonly exchangeRentServiceEth: ExchangeRentServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Lend }])
  public rent(@Payload() event: ILogEvent<IExchangeLendEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeRentServiceEth.rent(event, context);
  }
}
