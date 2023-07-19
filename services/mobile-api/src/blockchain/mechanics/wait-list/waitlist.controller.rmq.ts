import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { MobileEventType } from "@framework/types";

import type { IRmqCWaitListItem, IRmqCWaitListList } from "./waitlist.service";
import { WaitListService } from "./waitlist.service";

@Controller()
export class WaitListControllerRmq {
  constructor(private readonly claimService: WaitListService) {}

  @MessagePattern(MobileEventType.WAITLIST_REWARD_SET)
  public rewardSet(@Payload() dto: IRmqCWaitListList): Promise<void> {
    return this.claimService.rewardSet(dto);
  }

  @MessagePattern(MobileEventType.WAITLIST_REWARD_CLAIMED)
  public rewardClaimed(@Payload() dto: IRmqCWaitListItem): Promise<void> {
    return this.claimService.rewardClaimed(dto);
  }
}
