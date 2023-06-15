import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import type { IClaimCreateDto } from "@framework/types";
import { GameEventType } from "@framework/types";

import { ClaimServiceRmq } from "./claim.service.rmq";
import { ClaimEntity } from "./claim.entity";

@Controller()
export class ClaimControllerRmq {
  constructor(private readonly claimService: ClaimServiceRmq) {}

  @MessagePattern(GameEventType.CLAIM_TEST)
  public create(@Payload() dto: IClaimCreateDto): Promise<ClaimEntity> {
    return this.claimService.create(dto);
  }
}
