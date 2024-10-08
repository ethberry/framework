import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  IVrfSubscriptionConsumerAddedEvent,
  IVrfSubscriptionConsumerRemovedEvent,
  IVrfSubscriptionCreatedEvent,
} from "@framework/types";
import { ChainLinkEventType, ContractType } from "@framework/types";

import { ChainLinkSubscriptionServiceEth } from "./subscription.service.eth";

@Controller()
export class ChainLinkSubscriptionControllerEth {
  constructor(private readonly chainLinkSubscriptionServiceEth: ChainLinkSubscriptionServiceEth) {}

  @EventPattern([{ contractType: ContractType.VRF, eventName: ChainLinkEventType.SubscriptionCreated }])
  public createSubscription(
    @Payload() event: ILogEvent<IVrfSubscriptionCreatedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.chainLinkSubscriptionServiceEth.createSubscription(event, context);
  }

  @EventPattern([{ contractType: ContractType.VRF, eventName: ChainLinkEventType.SubscriptionConsumerAdded }])
  public consumerAdd(
    @Payload() event: ILogEvent<IVrfSubscriptionConsumerAddedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.chainLinkSubscriptionServiceEth.consumerAdd(event, context);
  }

  @EventPattern([{ contractType: ContractType.VRF, eventName: ChainLinkEventType.SubscriptionConsumerRemoved }])
  public consumerRemoved(
    @Payload() event: ILogEvent<IVrfSubscriptionConsumerRemovedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.chainLinkSubscriptionServiceEth.consumerRemoved(event, context);
  }
}
