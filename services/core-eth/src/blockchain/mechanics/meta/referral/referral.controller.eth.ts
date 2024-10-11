import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import {
  ContractManagerEventType,
  type IContractManagerStakingDeployedEvent,
  IReferralProgramEvent,
  ReferralProgramEventType,
} from "@framework/types";

import { ReferralServiceEth } from "./referral.service.eth";
import { ContractType } from "../../../../utils/contract-type";

@Controller()
export class ReferralControllerEth {
  constructor(private readonly referralServiceEth: ReferralServiceEth) {}

  @EventPattern([{ contractType: ContractType.REFERRAL, eventName: ReferralProgramEventType.ReferralEvent }])
  public refEvent(
    @Payload()
    event: ILogEvent<IReferralProgramEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.referralServiceEth.purchase(event, context);
  }

  @EventPattern([
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.StakingDeployed },
    { contractType: ContractType.CONTRACT_MANAGER, eventName: ContractManagerEventType.PonziDeployed },
  ])
  public deploy(
    @Payload()
    event: ILogEvent<IContractManagerStakingDeployedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.referralServiceEth.deploy(event, context);
  }
}
