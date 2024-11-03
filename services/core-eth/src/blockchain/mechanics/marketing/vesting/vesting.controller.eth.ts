import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerVestingTokenDeployedEvent, IVestingERC20ReleasedEvent } from "@framework/types";
import { ContractManagerEventType, VestingEventType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { VestingServiceEth } from "./vesting.service.eth";

@Controller()
export class VestingControllerEth {
  constructor(private readonly vestingServiceEth: VestingServiceEth) {}

  @EventPattern({ contractType: ContractType.VESTING, eventName: VestingEventType.ERC20Released })
  public erc20Released(@Payload() event: ILogEvent<IVestingERC20ReleasedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.erc20Released(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.VestingBoxDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerVestingTokenDeployedEvent>): void {
    return this.vestingServiceEth.deploy(event);
  }
}
