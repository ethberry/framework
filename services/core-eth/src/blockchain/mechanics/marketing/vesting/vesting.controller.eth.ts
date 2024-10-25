import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  IContractManagerVestingDeployedEvent,
  IOwnershipTransferredEvent,
  IVestingERC20ReleasedEvent,
  IVestingEtherReleasedEvent,
  IVestingPaymentReceivedEvent,
} from "@framework/types";
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

  @EventPattern({ contractType: ContractType.VESTING, eventName: VestingEventType.EtherReleased })
  public ethReleased(@Payload() event: ILogEvent<IVestingEtherReleasedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ethReleased(event, context);
  }

  @EventPattern({ contractType: ContractType.VESTING, eventName: VestingEventType.PaymentReceived })
  public ethReceived(@Payload() event: ILogEvent<IVestingPaymentReceivedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ethReceived(event, context);
  }

  @EventPattern({ contractType: ContractType.VESTING, eventName: AccessControlEventType.OwnershipTransferred })
  public ownership(@Payload() event: ILogEvent<IOwnershipTransferredEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ownershipTransferred(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.VestingDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerVestingDeployedEvent>): void {
    return this.vestingServiceEth.deploy(event);
  }
}
