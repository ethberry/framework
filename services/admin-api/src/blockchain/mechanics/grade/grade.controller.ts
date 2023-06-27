import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { PaginationDto } from "@gemunion/collection";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { GradeService } from "./grade.service";
import { GradeEntity } from "./grade.entity";
import { GradeCreateDto, GradeUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/grades")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto, @User() userEntity: UserEntity): Promise<[Array<GradeEntity>, number]> {
    return this.gradeService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: GradeCreateDto, @User() userEntity: UserEntity): Promise<GradeEntity> {
    return this.gradeService.createGrade(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: GradeUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<GradeEntity> {
    return this.gradeService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<GradeEntity | null> {
    return this.gradeService.findOneWithRelations({ id });
  }
}
