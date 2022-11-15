import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  IVestingERC20ReleasedEvent,
  IVestingEtherReceivedEvent,
  IVestingEtherReleasedEvent,
  VestingEventType,
} from "@framework/types";

import { VestingServiceEth } from "./vesting.service.eth";

@Controller()
export class VestingControllerEth {
  constructor(private readonly vestingServiceEth: VestingServiceEth) {}

  @EventPattern({ contractType: ContractType.VESTING, eventName: VestingEventType.ERC20Released })
  public erc20Released(@Payload() event: ILogEvent<IVestingERC20ReleasedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.erc20Released(event, context);
  }

  @EventPattern({ contractType: ContractType.VESTING, eventName: VestingEventType.EtherReleased })
  public ethReleased(@Payload() event: ILogEvent<IVestingEtherReleasedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ethReleased(event, context);
  }

  @EventPattern({ contractType: ContractType.VESTING, eventName: VestingEventType.EtherReceived })
  public ethReceived(@Payload() event: ILogEvent<IVestingEtherReceivedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ethReceived(event, context);
  }
}
