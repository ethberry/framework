import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { GradeService } from "./grade.service";
import { SignGradeDto } from "./dto";
import { UserEntity } from "../../user/user.entity";

@Public()
@Controller("/grade")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post("/sign")
  public sign(@Body() dto: SignGradeDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.gradeService.sign(dto, userEntity);
  }
}
