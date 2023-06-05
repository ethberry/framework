import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, ExchangeEventType, IClaimRewardEvent, IRewardSetEvent } from "@framework/types";

import { WaitlistItemServiceEth } from "./item.service.eth";

@Controller()
export class WaitlistItemControllerEth {
  constructor(private readonly waitlistServiceEth: WaitlistItemServiceEth) {}

  @EventPattern([{ contractType: ContractType.WAITLIST, eventName: ExchangeEventType.RewardSet }])
  public rewardSet(
    @Payload()
    event: ILogEvent<IRewardSetEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.waitlistServiceEth.rewardSet(event, context);
  }

  @EventPattern([{ contractType: ContractType.WAITLIST, eventName: ExchangeEventType.ClaimReward }])
  public withdraw(
    @Payload()
    event: ILogEvent<IClaimRewardEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.waitlistServiceEth.claimReward(event, context);
  }
}
