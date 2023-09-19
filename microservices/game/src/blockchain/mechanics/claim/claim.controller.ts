import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";
import { ClaimItemCreateDto, ClaimSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/claims")
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ClaimSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ClaimEntity>, number]> {
    return this.claimService.search(dto, merchantEntity);
  }

  @Post("/")
  public create(@Body() dto: ClaimItemCreateDto, @User() merchantEntity: MerchantEntity): Promise<ClaimEntity> {
    return this.claimService.create(dto, merchantEntity);
  }
}
