import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { AchievementsItemCountDto } from "./dto";
import { AchievementItemService } from "./item.service";
import { UserEntity } from "../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/achievements/item")
export class AchievementRuleController {
  constructor(private readonly achievementItemService: AchievementItemService) {}

  @Get("/count")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: AchievementsItemCountDto, @User() userEntity: UserEntity): Promise<number> {
    return this.achievementItemService.count(dto, userEntity);
  }
}
