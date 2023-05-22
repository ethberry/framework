import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { GameEventType } from "@framework/types";

import { ClaimServiceRmq } from "./claim.service.rmq";
import { ClaimEntity } from "./claim.entity";
import type { IClaimItemCreateDto } from "./interfaces";

@Controller()
export class ClaimControllerRmq {
  constructor(private readonly claimService: ClaimServiceRmq) {}

  @MessagePattern(GameEventType.CLAIM_TEST)
  public create(@Payload() dto: IClaimItemCreateDto): Promise<ClaimEntity> {
    return this.claimService.create(dto);
  }
}
