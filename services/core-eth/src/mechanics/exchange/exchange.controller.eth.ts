import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  ExchangeEventType,
  IExchangePurchase,
  IExchangeClaim,
  IExchangeCraft,
  IExchangeGrade,
  IExchangeLootbox,
} from "@framework/types";

import { ExchangeServiceEth } from "./exchange.service.eth";

@Controller()
export class ExchangeControllerEth {
  constructor(private readonly exchangeServiceEth: ExchangeServiceEth) {}

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Purchase })
  public purchase(@Payload() event: ILogEvent<IExchangePurchase>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.log(event, context);
  }

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Claim })
  public claim(@Payload() event: ILogEvent<IExchangeClaim>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.log(event, context);
  }

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Craft })
  public craft(@Payload() event: ILogEvent<IExchangeCraft>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.log(event, context);
  }

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Upgrade })
  public upgrade(@Payload() event: ILogEvent<IExchangeGrade>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.log(event, context);
  }

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Lootbox })
  public lootbox(@Payload() event: ILogEvent<IExchangeLootbox>, @Ctx() context: Log): Promise<void> {
    return this.exchangeServiceEth.log(event, context);
  }
}
