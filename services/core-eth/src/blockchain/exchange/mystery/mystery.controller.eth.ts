import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, IExchangeMysteryEvent } from "@framework/types";

import { ExchangeMysteryServiceEth } from "./mystery.service.eth";

@Controller()
export class ExchangeMysteryControllerEth {
  constructor(private readonly exchangeMysteryServiceEth: ExchangeMysteryServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Mysterybox }])
  public mysterybox(@Payload() event: ILogEvent<IExchangeMysteryEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeMysteryServiceEth.log(event, context);
  }
}
