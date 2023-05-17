import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementSignService } from "./sign.service";
import { SignAchievementDto } from "./dto";

@Public()
@Controller("/achievements")
export class AchievementSignController {
  constructor(private readonly achievementSignService: AchievementSignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignAchievementDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.achievementSignService.sign(dto, userEntity);
  }
}
