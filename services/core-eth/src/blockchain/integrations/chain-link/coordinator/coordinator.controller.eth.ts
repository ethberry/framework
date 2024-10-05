import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ChainLinkEventType, ChainLinkType, IVrfRandomWordsRequestedEvent } from "@framework/types";

import { ChainLinkCoordinatorServiceEth } from "./coordinator.service.eth";

@Controller()
export class ChainLinkCoordinatorControllerEth {
  constructor(private readonly chainLinkCoordinatorServiceEth: ChainLinkCoordinatorServiceEth) {}

  @EventPattern([{ contractType: ChainLinkType.VRF, eventName: ChainLinkEventType.RandomWordsRequested }])
  public randomRequest(@Payload() event: ILogEvent<IVrfRandomWordsRequestedEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkCoordinatorServiceEth.randomRequest(event, context);
  }
}
