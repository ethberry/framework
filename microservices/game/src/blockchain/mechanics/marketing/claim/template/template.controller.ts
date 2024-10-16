import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { ClaimEntity } from "../claim.entity";
import { ClaimTemplateService } from "./template.service";
import { ClaimTemplateCreateDto, ClaimTemplateSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/claims/templates")
export class ClaimTemplateController {
  constructor(private readonly claimService: ClaimTemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ClaimTemplateSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ClaimEntity>, number]> {
    return this.claimService.search(dto, merchantEntity);
  }

  @Post("/")
  public create(@Body() dto: ClaimTemplateCreateDto, @User() merchantEntity: MerchantEntity): Promise<ClaimEntity> {
    return this.claimService.create(dto, merchantEntity);
  }
}
