import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { AchievementItemService } from "./item.service";
import { UserEntity } from "../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/achievements/items")
export class AchievementItemController {
  constructor(private readonly achievementItemService: AchievementItemService) {}

  @Get("/count")
  public search(@User() userEntity: UserEntity): Promise<number> {
    return this.achievementItemService.count(userEntity);
  }
}
