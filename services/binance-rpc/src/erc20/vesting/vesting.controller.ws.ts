import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IEvent } from "@gemunion/nestjs-web3";
import { Erc20VestingEventType, IErc20VestingERC20Released, IErc20VestingEtherReleased } from "@framework/types";

import { ContractType } from "../../common/interfaces";
import { Erc20VestingServiceWs } from "./vesting.service.ws";

@Controller()
export class Erc20VestingControllerWs {
  constructor(private readonly erc20VestingServiceWs: Erc20VestingServiceWs) {}

  @EventPattern({ contractName: ContractType.ERC20_VESTING, eventName: Erc20VestingEventType.ERC20Released })
  public erc20Released(@Payload() event: IEvent<IErc20VestingERC20Released>): Promise<void> {
    return this.erc20VestingServiceWs.erc20Released(event);
  }

  @EventPattern({ contractName: ContractType.ERC20_VESTING, eventName: Erc20VestingEventType.EtherReleased })
  public ethReleased(@Payload() event: IEvent<IErc20VestingEtherReleased>): Promise<void> {
    return this.erc20VestingServiceWs.ethReleased(event);
  }
}
