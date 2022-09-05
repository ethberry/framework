import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-collection";

import { BreedService } from "./breed.service";
import { SignGradeDto } from "./dto";
import { UserEntity } from "../../../user/user.entity";

@Public()
@Controller("/breed")
export class BreedController {
  constructor(private readonly gradeService: BreedService) {}

  @Post("/sign")
  public sign(@Body() dto: SignGradeDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.gradeService.sign(dto, userEntity);
  }
}
