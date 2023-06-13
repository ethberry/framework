import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import type { IWaitlistClaimRewardEvent, IWaitlistSetRewardEvent } from "@framework/types";
import { ContractType, WaitlistEventType } from "@framework/types";

import { WaitlistItemServiceEth } from "./item.service.eth";

@Controller()
export class WaitlistItemControllerEth {
  constructor(private readonly waitlistServiceEth: WaitlistItemServiceEth) {}

  @EventPattern([{ contractType: ContractType.WAITLIST, eventName: WaitlistEventType.RewardSet }])
  public rewardSet(
    @Payload()
    event: ILogEvent<IWaitlistSetRewardEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.waitlistServiceEth.rewardSet(event, context);
  }

  @EventPattern([{ contractType: ContractType.WAITLIST, eventName: WaitlistEventType.ClaimReward }])
  public withdraw(
    @Payload()
    event: ILogEvent<IWaitlistClaimRewardEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.waitlistServiceEth.claimReward(event, context);
  }
}
