import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerVestingDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerVestingServiceEth } from "./vesting.service.eth";

@Controller()
export class ContractManagerVestingControllerEth {
  constructor(private readonly contractManagerVestingServiceEth: ContractManagerVestingServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.VestingDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerVestingDeployedEvent>, @Ctx() context: Log): Promise<void> {
    return this.contractManagerVestingServiceEth.deploy(event, context);
  }
}
