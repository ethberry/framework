import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ChainLinkEventType, ChainLinkType, IVrfRandomWordsRequestedEvent } from "@framework/types";

import { ChainLinkContractServiceEth } from "./contract.service.eth";

@Controller()
export class ChainLinkContractControllerEth {
  constructor(private readonly chainLinkServiceEth: ChainLinkContractServiceEth) {}

  @EventPattern([{ contractType: ChainLinkType.VRF, eventName: ChainLinkEventType.RandomWordsRequested }])
  public randomRequest(@Payload() event: ILogEvent<IVrfRandomWordsRequestedEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkServiceEth.randomRequest(event, context);
  }
}
