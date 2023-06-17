import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import type { IWaitListList } from "@framework/types";
import { MobileEventType } from "@framework/types";

import { WaitListService } from "./waitlist.service";

@Controller()
export class WaitListControllerRmq {
  constructor(private readonly claimService: WaitListService) {}

  @MessagePattern(MobileEventType.WAITLIST_REWARD_SET)
  public rewardSet(@Payload() dto: IWaitListList): Promise<void> {
    return this.claimService.rewardSet(dto);
  }

  @MessagePattern(MobileEventType.WAITLIST_REWARD_CLAIMED)
  public rewardClaimed(@Payload() dto: IWaitListList): Promise<void> {
    return this.claimService.rewardClaimed(dto);
  }
}
