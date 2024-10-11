import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { IERC721TokenMintRandomEvent, IVrfSubscriptionSetEvent } from "@framework/types";
import { ChainLinkEventType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { ChainLinkConsumerServiceEth } from "./consumer.service.eth";

@Controller()
export class ChainLinkConsumerControllerEth {
  constructor(private readonly chainLinkConsumerServiceEth: ChainLinkConsumerServiceEth) {}

  @EventPattern({ contractType: ContractType.RANDOM, eventName: ChainLinkEventType.VrfSubscriptionSet })
  public setSubscription(@Payload() event: ILogEvent<IVrfSubscriptionSetEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkConsumerServiceEth.setVrfSubscription(event, context);
  }

  @EventPattern({ contractType: ContractType.RANDOM, eventName: ChainLinkEventType.MintRandom })
  public mintRandom(@Payload() event: ILogEvent<IERC721TokenMintRandomEvent>, @Ctx() context: Log): Promise<void> {
    return this.chainLinkConsumerServiceEth.mintRandom(event, context);
  }
}
