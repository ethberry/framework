import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { AutocompleteGradeDto, SearchGradeDto, SignGradeDto } from "./dto";
import { GradeService } from "./grade.service";
import { GradeEntity } from "./grade.entity";

@Public()
@Controller("/grade")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post("/sign")
  public sign(@Body() dto: SignGradeDto): Promise<IServerSignature> {
    return this.gradeService.sign(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: AutocompleteGradeDto): Promise<Array<GradeEntity>> {
    return this.gradeService.autocomplete(dto);
  }

  @Get("/")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Query() dto: SearchGradeDto): Promise<GradeEntity | null> {
    return this.gradeService.findOneByToken(dto);
  }
}
