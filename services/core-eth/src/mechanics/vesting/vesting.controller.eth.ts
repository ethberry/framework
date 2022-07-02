import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, VestingEventType, IVestingERC20Released, IVestingEtherReleased } from "@framework/types";

import { VestingServiceEth } from "./vesting.service.eth";

@Controller()
export class VestingControllerEth {
  constructor(private readonly vestingServiceEth: VestingServiceEth) {}

  @EventPattern({ contractType: ContractType.VESTING, eventName: VestingEventType.ERC20Released })
  public erc20Released(@Payload() event: ILogEvent<IVestingERC20Released>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.erc20Released(event, context);
  }

  @EventPattern({ contractType: ContractType.VESTING, eventName: VestingEventType.EtherReleased })
  public ethReleased(@Payload() event: ILogEvent<IVestingEtherReleased>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ethReleased(event, context);
  }
}
