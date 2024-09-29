import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IExchangeMergeEvent } from "@framework/types";
import { ContractType, ExchangeEventType } from "@framework/types";

import { ExchangeMergeServiceEth } from "./merge.service.eth";

@Controller()
export class ExchangeMergeControllerEth {
  constructor(private readonly exchangeMergeServiceEth: ExchangeMergeServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Merge }])
  public merge(@Payload() event: ILogEvent<IExchangeMergeEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeMergeServiceEth.merge(event, context);
  }
}
