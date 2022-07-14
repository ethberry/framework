import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { GradeService } from "./grade.service";
import { LevelUpDto } from "./dto";
import { UserEntity } from "../../user/user.entity";

@Public()
@Controller("/grade")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post("/level-up")
  public levelUp(@Body() dto: LevelUpDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.gradeService.levelUp(dto, userEntity);
  }
}
