import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangeClaimTemplateEvent, IExchangeClaimTokenEvent } from "@framework/types";
import { ExchangeEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ExchangeClaimServiceEth } from "./claim.service.eth";

@Controller()
export class ExchangeClaimControllerEth {
  constructor(private readonly exchangeClaimServiceEth: ExchangeClaimServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.ClaimTemplate }])
  public claimTemplate(@Payload() event: ILogEvent<IExchangeClaimTemplateEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeClaimServiceEth.claimTemplate(event, context);
  }

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.ClaimToken }])
  public claimToken(@Payload() event: ILogEvent<IExchangeClaimTokenEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeClaimServiceEth.claimToken(event, context);
  }
}
