import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  ContractType,
  IOwnershipTransferredEvent,
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

  @EventPattern({ contractType: ContractType.VESTING, eventName: VestingEventType.PaymentEthReceived })
  public ethReceived(@Payload() event: ILogEvent<IVestingEtherReceivedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ethReceived(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.VESTING,
      eventName: AccessControlEventType.OwnershipTransferred,
    },
  ])
  public ownership(@Payload() event: ILogEvent<IOwnershipTransferredEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ownershipChanged(event, context);
  }
}
