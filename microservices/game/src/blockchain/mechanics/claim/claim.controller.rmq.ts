import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import type { IClaimItemCreateDto } from "@framework/types";
import { GameEventType } from "@framework/types";

import { ClaimServiceRmq } from "./claim.service.rmq";
import { ClaimEntity } from "./claim.entity";

@Controller()
export class ClaimControllerRmq {
  constructor(private readonly claimService: ClaimServiceRmq) {}

  @MessagePattern(GameEventType.CLAIM_TEST)
  public create(@Payload() dto: IClaimItemCreateDto): Promise<ClaimEntity> {
    return this.claimService.create(dto);
  }
}
