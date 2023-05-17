import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";
import { ClaimItemCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/claims")
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post("/")
  public create(@Body() dto: ClaimItemCreateDto, @User() merchantEntity: MerchantEntity): Promise<ClaimEntity> {
    return this.claimService.create(dto, merchantEntity);
  }
}
