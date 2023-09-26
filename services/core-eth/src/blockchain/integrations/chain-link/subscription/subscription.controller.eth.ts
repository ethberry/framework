import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

import { ChainLinkSubscriptionServiceEth } from "./subscription.service.eth";
import { ChainLinkEventType, ChainLinkType } from "../interfaces";
import { IVrfSubscriptionCreatedEvent } from "@framework/types";

@Controller()
export class ChainLinkSubscriptionControllerEth {
  constructor(private readonly chainLinkServiceEth: ChainLinkSubscriptionServiceEth) {}

  @EventPattern([{ contractType: ChainLinkType.VRF_SUB, eventName: ChainLinkEventType.SubscriptionCreated }])
  public createSubscription(
    @Payload() event: ILogEvent<IVrfSubscriptionCreatedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.chainLinkServiceEth.createSubscription(event, context);
  }
}
