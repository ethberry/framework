import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { MobileEventType } from "@framework/types";

import type { IRmqCWaitListItem, IRmqCWaitListList } from "./wait-list.service";
import { WaitListService } from "./wait-list.service";

@Controller()
export class WaitListControllerRmq {
  constructor(private readonly waitListService: WaitListService) {}

  @MessagePattern(MobileEventType.WAITLIST_REWARD_SET)
  public rewardSet(@Payload() dto: IRmqCWaitListList): Promise<void> {
    return this.waitListService.rewardSet(dto);
  }

  @MessagePattern(MobileEventType.WAITLIST_REWARD_CLAIMED)
  public rewardClaimed(@Payload() dto: IRmqCWaitListItem): Promise<void> {
    return this.waitListService.rewardClaimed(dto);
  }
}
