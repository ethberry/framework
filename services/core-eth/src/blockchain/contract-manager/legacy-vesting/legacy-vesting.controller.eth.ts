import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerLegacyVestingDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerLegacyVestingServiceEth } from "./legacy-vesting.service.eth";

@Controller()
export class ContractManagerLegacyVestingControllerEth {
  constructor(private readonly contractManagerLegacyVestingServiceEth: ContractManagerLegacyVestingServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.LegacyVestingDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerLegacyVestingDeployedEvent>, @Ctx() context: Log): Promise<void> {
    return this.contractManagerLegacyVestingServiceEth.deploy(event, context);
  }
}
