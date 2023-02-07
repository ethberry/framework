import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";

import { ChainLinkServiceEth } from "./chain-link.service.eth";
import { ChainLinkEventType, ChainLinkType, IChainLinkRandomRequestEvent } from "./log/interfaces";

@Controller()
export class ChainLinkControllerEth {
  constructor(private readonly chainLinkServiceEth: ChainLinkServiceEth) {}

  @EventPattern({ contractType: ChainLinkType.VRF, eventName: ChainLinkEventType.RandomnessRequestId })
  public randomRequest(@Payload() event: ILogEvent<IChainLinkRandomRequestEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkServiceEth.randomRequest(event, context);
  }
}
