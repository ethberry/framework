import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ContractType, IClaimRewardEvent, IRewardSetEvent, ExchangeEventType } from "@framework/types";

import { WaitlistServiceEth } from "./waitlist.service.eth";

@Controller()
export class WaitlistControllerEth {
  constructor(private readonly waitlistServiceEth: WaitlistServiceEth) {}

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
