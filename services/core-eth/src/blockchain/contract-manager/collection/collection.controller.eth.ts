import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerCollectionDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerCollectionServiceEth } from "./collection.service.eth";

@Controller()
export class ContractManagerCollectionControllerEth {
  constructor(private readonly contractManagerCollectionServiceEth: ContractManagerCollectionServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.CollectionDeployed,
  })
  public deploy(
    @Payload() event: ILogEvent<IContractManagerCollectionDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerCollectionServiceEth.deploy(event, context);
  }
}
