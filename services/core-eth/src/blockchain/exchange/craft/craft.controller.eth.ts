import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ContractType, ExchangeEventType } from "@framework/types";
import type { IExchangeCraftEvent } from "@framework/types";

import { ExchangeCraftServiceEth } from "./craft.service.eth";

@Controller()
export class ExchangeCraftControllerEth {
  constructor(private readonly exchangeCraftServiceEth: ExchangeCraftServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.Craft }])
  public craft(@Payload() event: ILogEvent<IExchangeCraftEvent>, @Ctx() context: Log): Promise<void> {
    return this.exchangeCraftServiceEth.craft(event, context);
  }
}
