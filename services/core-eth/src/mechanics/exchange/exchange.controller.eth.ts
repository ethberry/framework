import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, ITransaction } from "@framework/types";

import { ExchangeServiceEth } from "./exchange.service.eth";

@Controller()
export class ExchangeControllerEth {
  constructor(private readonly exchangeServiceEth: ExchangeServiceEth) {}

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Purchase })
  public purchase(@Payload() event: ILogEvent<ITransaction>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.purchase(event, context);
  }
}
