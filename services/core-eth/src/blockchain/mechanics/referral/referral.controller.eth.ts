import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, IReward, IWithdraw, ReferralProgramEventType } from "@framework/types";

import { ReferralServiceEth } from "./referral.service.eth";

@Controller()
export class ReferralControllerEth {
  constructor(private readonly referralServiceEth: ReferralServiceEth) {}

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ReferralProgramEventType.ReferralReward })
  public reward(
    @Payload()
    event: ILogEvent<IReward>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.referralServiceEth.reward(event, context);
  }

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ReferralProgramEventType.ReferralWithdraw })
  public withdraw(
    @Payload()
    event: ILogEvent<IWithdraw>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.referralServiceEth.withdraw(event, context);
  }
}
