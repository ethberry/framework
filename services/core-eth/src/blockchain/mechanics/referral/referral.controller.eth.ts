import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ContractType, IReferralRewardEvent, IReferralWithdrawEvent, ReferralProgramEventType } from "@framework/types";

import { ReferralServiceEth } from "./referral.service.eth";

@Controller()
export class ReferralControllerEth {
  constructor(private readonly referralServiceEth: ReferralServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ReferralProgramEventType.ReferralReward }])
  public reward(
    @Payload()
    event: ILogEvent<IReferralRewardEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.referralServiceEth.reward(event, context);
  }

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ReferralProgramEventType.ReferralWithdraw }])
  public withdraw(
    @Payload()
    event: ILogEvent<IReferralWithdrawEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.referralServiceEth.withdraw(event, context);
  }
}
