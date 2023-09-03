import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { GradeService } from "./grade.service";
import { GradeEntity } from "./grade.entity";
import { AutocompleteGradeDto, SearchGradeDto, GradeSignDto } from "./dto";

@Public()
@Controller("/grade")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post("/sign")
  public sign(@Body() dto: GradeSignDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.gradeService.sign(dto, merchantEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: AutocompleteGradeDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<GradeEntity>> {
    return this.gradeService.autocomplete(dto, merchantEntity);
  }

  @Get("/")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Query() dto: SearchGradeDto, @User() merchantEntity: MerchantEntity): Promise<GradeEntity | null> {
    return this.gradeService.findOneByToken(dto, merchantEntity);
  }
}
