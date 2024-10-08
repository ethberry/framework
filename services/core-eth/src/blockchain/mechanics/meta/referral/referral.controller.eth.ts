import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ContractType, IReferralProgramEvent, ReferralProgramEventType } from "@framework/types";

import { ReferralServiceEth } from "./referral.service.eth";

@Controller()
export class ReferralControllerEth {
  constructor(private readonly referralServiceEth: ReferralServiceEth) {}

  @EventPattern([
    { contractType: ContractType.EXCHANGE, eventName: ReferralProgramEventType.ReferralEvent },
    { contractType: ContractType.PONZI, eventName: ReferralProgramEventType.ReferralEvent },
    { contractType: ContractType.STAKING, eventName: ReferralProgramEventType.ReferralEvent },
  ])
  public refEvent(
    @Payload()
    event: ILogEvent<IReferralProgramEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.referralServiceEth.refEvent(event, context);
  }
}
