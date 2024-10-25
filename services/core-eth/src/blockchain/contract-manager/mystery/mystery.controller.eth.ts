import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerMysteryTokenDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerMysteryServiceEth } from "./mystery.service.eth";

@Controller()
export class ContractManagerMysteryControllerEth {
  constructor(private readonly contractManagerMysteryServiceEth: ContractManagerMysteryServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.MysteryBoxDeployed,
  })
  public deploy(
    @Payload() event: ILogEvent<IContractManagerMysteryTokenDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.contractManagerMysteryServiceEth.deploy(event, context);
  }
}
