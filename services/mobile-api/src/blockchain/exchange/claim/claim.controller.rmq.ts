import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { MobileEventType } from "@framework/types";

import type { IRmqClaim } from "./claim.service";
import { ClaimService } from "./claim.service";

@Controller()
export class ClaimControllerRmq {
  constructor(private readonly claimService: ClaimService) {}

  @MessagePattern(MobileEventType.CLAIM)
  public claim(@Payload() dto: IRmqClaim): Promise<void> {
    return this.claimService.claim(dto);
  }
}
