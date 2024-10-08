import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IVrfSubscriptionSetEvent } from "@framework/types";
import { ChainLinkEventType, ContractType } from "@framework/types";

import { ChainLinkConsumerServiceEth } from "./consumer.service.eth";

@Controller()
export class ChainLinkConsumerControllerEth {
  constructor(private readonly chainLinkConsumerServiceEth: ChainLinkConsumerServiceEth) {}

  @EventPattern([
    { contractType: ContractType.ERC721_TOKEN_RANDOM, eventName: ChainLinkEventType.VrfSubscriptionSet },
    { contractType: ContractType.ERC998_TOKEN_RANDOM, eventName: ChainLinkEventType.VrfSubscriptionSet },
    { contractType: ContractType.LOTTERY, eventName: ChainLinkEventType.VrfSubscriptionSet },
    { contractType: ContractType.RAFFLE, eventName: ChainLinkEventType.VrfSubscriptionSet },
    { contractType: ContractType.LOOT, eventName: ChainLinkEventType.VrfSubscriptionSet },
  ])
  public setSubscription(@Payload() event: ILogEvent<IVrfSubscriptionSetEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkConsumerServiceEth.setVrfSubscription(event, context);
  }
}
