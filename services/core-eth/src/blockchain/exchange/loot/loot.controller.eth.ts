import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangePurchaseLootBoxEvent } from "@framework/types";
import { ExchangeEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ExchangeLootServiceEth } from "./loot.service.eth";

@Controller()
export class ExchangeLootControllerEth {
  constructor(private readonly exchangeLootServiceEth: ExchangeLootServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.PurchaseLootBox }])
  public purchaseLoot(@Payload() event: ILogEvent<IExchangePurchaseLootBoxEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeLootServiceEth.log(event, context);
  }
}
