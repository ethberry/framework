import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import { Erc20VestingEventType, IErc20VestingVestingDeployed } from "@framework/types";

import { ContractType } from "../../common/interfaces";
import { Erc20VestingServiceWs } from "./vesting.service.ws";

@Controller()
export class Erc20VestingControllerWs {
  constructor(private readonly erc20VestingServiceWs: Erc20VestingServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC20_VESTING, eventName: Erc20VestingEventType.VestingDeployed })
  public transfer(@Payload() event: IEvent<IErc20VestingVestingDeployed>): Promise<void> {
    return this.erc20VestingServiceWs.created(event);
  }
}
