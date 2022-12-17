import { Body, Controller, Get, Param, ParseIntPipe, Post, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { GradeService } from "./grade.service";
import { SignGradeDto } from "./dto";
import { UserEntity } from "../../../user/user.entity";
import { GradeEntity } from "./grade.entity";

@Public()
@Controller("/grade")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post("/sign")
  public sign(@Body() dto: SignGradeDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.gradeService.sign(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<GradeEntity | null> {
    return this.gradeService.findOneByToken({ id });
  }
}
