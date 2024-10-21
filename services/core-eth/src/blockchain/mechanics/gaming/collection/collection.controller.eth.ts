import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { ICollectionConsecutiveTransfer, IContractManagerCommonDeployedEvent } from "@framework/types";
import { CollectionEventType, ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { CollectionServiceEth } from "./collection.service.eth";

@Controller()
export class CollectionControllerEth {
  constructor(public readonly collectionServiceEth: CollectionServiceEth) {}

  @EventPattern([{ contractType: ContractType.COLLECTION, eventName: CollectionEventType.ConsecutiveTransfer }])
  public consecutiveTransfer(
    @Payload() event: ILogEvent<ICollectionConsecutiveTransfer>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.collectionServiceEth.consecutiveTransfer(event, context);
  }

  @EventPattern({ contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.CollectionDeployed })
  public deploy(@Payload() event: ILogEvent<IContractManagerCommonDeployedEvent>, @Ctx() context: Log): Promise<void> {
    return this.collectionServiceEth.deploy(event, context);
  }
}
