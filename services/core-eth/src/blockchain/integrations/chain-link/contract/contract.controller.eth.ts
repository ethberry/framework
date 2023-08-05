import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

import { ChainLinkContractServiceEth } from "./contract.service.eth";
import { ChainLinkEventType, ChainLinkType, IChainLinkRandomWordsRequestedEvent } from "./log/interfaces";

@Controller()
export class ChainLinkContractControllerEth {
  constructor(private readonly chainLinkServiceEth: ChainLinkContractServiceEth) {}

  @EventPattern([{ contractType: ChainLinkType.VRF, eventName: ChainLinkEventType.RandomWordsRequested }])
  public randomRequest(
    @Payload() event: ILogEvent<IChainLinkRandomWordsRequestedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.chainLinkServiceEth.randomRequest(event, context);
  }
}
