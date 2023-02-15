import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { GradeService } from "./grade.service";
import { SignGradeDto } from "./dto";
import { UserEntity } from "../../../ecommerce/user/user.entity";
import { GradeEntity } from "./grade.entity";

@Public()
@Controller("/grade")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post("/sign")
  public sign(@Body() dto: SignGradeDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.gradeService.sign(dto, userEntity);
  }

  @Get("/")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Query() dto: SignGradeDto): Promise<GradeEntity | null> {
    return this.gradeService.findOneByToken(dto);
  }
}
