import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";
import { ClaimItemCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/claims")
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post("/")
  public create(@Body() dto: ClaimItemCreateDto): Promise<ClaimEntity> {
    return this.claimService.create(dto);
  }
}
