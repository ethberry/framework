import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ChainLinkEventType, IVrfRandomWordsRequestedEvent } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { ChainLinkCoordinatorServiceEth } from "./coordinator.service.eth";

@Controller()
export class ChainLinkCoordinatorControllerEth {
  constructor(private readonly chainLinkCoordinatorServiceEth: ChainLinkCoordinatorServiceEth) {}

  @EventPattern([{ contractType: ContractType.VRF, eventName: ChainLinkEventType.RandomWordsRequested }])
  public randomRequest(@Payload() event: ILogEvent<IVrfRandomWordsRequestedEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkCoordinatorServiceEth.randomRequest(event, context);
  }
}
