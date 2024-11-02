import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  AccessControlEventType,
  IContractManagerLegacyVestingDeployedEvent,
  IOwnershipTransferredEvent,
  ILegacyVestingERC20ReleasedEvent,
  ILegacyVestingEtherReleasedEvent,
  ILegacyVestingPaymentReceivedEvent,
} from "@framework/types";
import { ContractManagerEventType, LegacyVestingEventType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { LegacyVestingServiceEth } from "./legacy-vesting.service.eth";

@Controller()
export class LegacyVestingControllerEth {
  constructor(private readonly vestingServiceEth: LegacyVestingServiceEth) {}

  @EventPattern({ contractType: ContractType.VESTING, eventName: LegacyVestingEventType.ERC20Released })
  public erc20Released(@Payload() event: ILogEvent<ILegacyVestingERC20ReleasedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.erc20Released(event, context);
  }

  @EventPattern({ contractType: ContractType.VESTING, eventName: LegacyVestingEventType.EtherReleased })
  public ethReleased(@Payload() event: ILogEvent<ILegacyVestingEtherReleasedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ethReleased(event, context);
  }

  @EventPattern({ contractType: ContractType.VESTING, eventName: LegacyVestingEventType.PaymentReceived })
  public ethReceived(@Payload() event: ILogEvent<ILegacyVestingPaymentReceivedEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ethReceived(event, context);
  }

  @EventPattern({ contractType: ContractType.VESTING, eventName: AccessControlEventType.OwnershipTransferred })
  public ownership(@Payload() event: ILogEvent<IOwnershipTransferredEvent>, @Ctx() context: Log): Promise<void> {
    return this.vestingServiceEth.ownershipTransferred(event, context);
  }

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.LegacyVestingDeployed,
  })
  public deploy(@Payload() event: ILogEvent<IContractManagerLegacyVestingDeployedEvent>): void {
    return this.vestingServiceEth.deploy(event);
  }
}
