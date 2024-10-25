import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerLootTokenDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerLootServiceEth } from "./loot.service.eth";

@Controller()
export class ContractManagerLootControllerEth {
  constructor(private readonly contractManagerLootServiceEth: ContractManagerLootServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.LootBoxDeployed,
  })
  public deploy(
    @Payload() event: ILogEvent<IContractManagerLootTokenDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerLootServiceEth.deploy(event, context);
  }
}
