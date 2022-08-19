import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { PaginationDto } from "@gemunion/collection";

import { GradeService } from "./grade.service";
import { GradeEntity } from "./grade.entity";
import { GradeUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/grades")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<GradeEntity>, number]> {
    return this.gradeService.search(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: GradeUpdateDto): Promise<GradeEntity> {
    return this.gradeService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<GradeEntity | null> {
    return this.gradeService.findOneWithRelations({ id });
  }
}
