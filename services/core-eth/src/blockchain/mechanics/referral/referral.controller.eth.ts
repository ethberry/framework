import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, IReward, ReferralProgramEventType } from "@framework/types";

import { ReferralServiceEth } from "./referral.service.eth";

@Controller()
export class ReferralControllerEth {
  constructor(private readonly referralServiceEth: ReferralServiceEth) {}

  @EventPattern({ contractType: ContractType.EXCHANGE, eventName: ReferralProgramEventType.Reward })
  public claim(
    @Payload()
    event: ILogEvent<IReward>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.referralServiceEth.reward(event, context);
  }
}
