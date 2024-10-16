import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { MobileEventType } from "@framework/types";

import type { IRmqClaimTemplate, IRmqClaimToken } from "./interface";
import { ClaimService } from "./claim.service";

@Controller()
export class ClaimControllerRmq {
  constructor(private readonly claimService: ClaimService) {}

  @MessagePattern(MobileEventType.CLAIM_TEMPLATE)
  public rewardSet(@Payload() dto: IRmqClaimTemplate): Promise<void> {
    return this.claimService.rewardSet(dto);
  }

  @MessagePattern(MobileEventType.CLAIM_TOKEN)
  public rewardClaimed(@Payload() dto: IRmqClaimToken): Promise<void> {
    return this.claimService.rewardClaimed(dto);
  }
}
