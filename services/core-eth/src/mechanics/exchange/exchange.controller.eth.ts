import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  ExchangeEventType,
  IExchangeClaim,
  IExchangeCraft,
  IExchangeGrade,
  IExchangeLootbox,
  IExchangePurchase,
} from "@framework/types";

import { ExchangeServiceEth } from "./exchange.service.eth";

@Controller()
export class ExchangeControllerEth {
  constructor(private readonly exchangeServiceEth: ExchangeServiceEth) {}

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Purchase })
  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Claim })
  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Craft })
  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Upgrade })
  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Lootbox })
  public exchange(
    @Payload()
    event: ILogEvent<IExchangePurchase | IExchangeClaim | IExchangeCraft | IExchangeGrade | IExchangeLootbox>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeServiceEth.log(event, context);
  }
}
