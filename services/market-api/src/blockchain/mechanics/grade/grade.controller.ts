import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { GradeService } from "./grade.service";
import { GradeEntity } from "./grade.entity";
import { GradeAutocompleteDto, GradeSearchDto, GradeSignDto } from "./dto";

@Public()
@Controller("/grade")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Get("/")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Query() dto: GradeSearchDto): Promise<GradeEntity | null> {
    return this.gradeService.findOneByToken(dto);
  }

  @Post("/sign")
  public sign(@Body() dto: GradeSignDto): Promise<IServerSignature> {
    return this.gradeService.sign(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: GradeAutocompleteDto): Promise<Array<GradeEntity>> {
    return this.gradeService.autocomplete(dto);
  }
}
