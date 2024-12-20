import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeClaimEvent } from "@framework/types";
import { ContractType, ExchangeEventType } from "@framework/types";

import { ExchangeClaimServiceEth } from "./claim.service.eth";

@Controller()
export class ExchangeClaimControllerEth {
  constructor(private readonly exchangeClaimServiceEth: ExchangeClaimServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Claim }])
  public claim(@Payload() event: ILogEvent<IExchangeClaimEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeClaimServiceEth.claim(event, context);
  }
}
