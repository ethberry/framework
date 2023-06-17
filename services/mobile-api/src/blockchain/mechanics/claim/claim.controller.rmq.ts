import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import type { IClaim } from "@framework/types";
import { MobileEventType } from "@framework/types";

import { ClaimService } from "./claim.service";

@Controller()
export class ClaimControllerRmq {
  constructor(private readonly claimService: ClaimService) {}

  @MessagePattern(MobileEventType.CLAIM)
  public claim(@Payload() dto: IClaim): Promise<void> {
    return this.claimService.claim(dto);
  }
}
