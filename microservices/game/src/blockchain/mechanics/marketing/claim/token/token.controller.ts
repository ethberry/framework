import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { ClaimTokenService } from "./token.service";
import { ClaimEntity } from "../claim.entity";
import { ClaimTokenCreateDto, ClaimTokenSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/claims/tokens")
export class ClaimTokenController {
  constructor(private readonly claimService: ClaimTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ClaimTokenSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ClaimEntity>, number]> {
    return this.claimService.search(dto, merchantEntity);
  }

  @Post("/")
  public create(@Body() dto: ClaimTokenCreateDto, @User() merchantEntity: MerchantEntity): Promise<ClaimEntity> {
    return this.claimService.create(dto, merchantEntity);
  }
}
