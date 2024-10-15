import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { CollectionEventType, ICollectionConsecutiveTransfer } from "@framework/types";

import { CollectionServiceEth } from "./collection.service.eth";
import { ContractType } from "../../../../utils/contract-type";

@Controller()
export class CollectionControllerEth {
  constructor(public readonly collectionServiceEth: CollectionServiceEth) {}

  @EventPattern([{ contractType: ContractType.COLLECTION, eventName: CollectionEventType.ConsecutiveTransfer }])
  public levelUp(@Payload() event: ILogEvent<ICollectionConsecutiveTransfer>, @Ctx() context: Log): Promise<void> {
    return this.collectionServiceEth.consecutiveTransfer(event, context);
  }
}
