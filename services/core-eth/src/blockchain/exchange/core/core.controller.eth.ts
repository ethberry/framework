import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IErc1363TransferReceivedEvent, IExchangePurchaseEvent } from "@framework/types";
import { ContractType, Erc1363EventType, ExchangeEventType } from "@framework/types";

import { ExchangeCoreServiceEth } from "./core.service.eth";

@Controller()
export class ExchangeCoreControllerEth {
  constructor(private readonly exchangeCoreServiceEth: ExchangeCoreServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Purchase }])
  public purchase(@Payload() event: ILogEvent<IExchangePurchaseEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeCoreServiceEth.purchase(event, context);
  }

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: Erc1363EventType.TransferReceived })
  public transferReceived(
    @Payload() event: ILogEvent<IErc1363TransferReceivedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.exchangeCoreServiceEth.transferReceived(event, context);
  }
}
