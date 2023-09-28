import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";

import { ChainLinkSubscriptionServiceEth } from "./subscription.service.eth";
import { ChainLinkEventType, ChainLinkType } from "../interfaces";
import {
  ContractEventType,
  ContractType,
  IVrfSubscriptionCreatedEvent,
  IVrfSubscriptionConsumerAddedEvent,
  IVrfSubscriptionSetEvent,
} from "@framework/types";

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

  @EventPattern([{ contractType: ChainLinkType.VRF_SUB, eventName: ChainLinkEventType.SubscriptionConsumerAdded }])
  public consumerAdd(
    @Payload() event: ILogEvent<IVrfSubscriptionConsumerAddedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.chainLinkServiceEth.consumerAdd(event, context);
  }

  @EventPattern([
    { contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: ContractEventType.VrfSubscriptionSet },
    { contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ContractEventType.VrfSubscriptionSet },
    { contractType: ContractType.LOTTERY, eventName: ContractEventType.VrfSubscriptionSet },
    { contractType: ContractType.RAFFLE, eventName: ContractEventType.VrfSubscriptionSet },
  ])
  public setSubscription(@Payload() event: ILogEvent<IVrfSubscriptionSetEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkServiceEth.setVrfSubscription(event, context);
  }
}
