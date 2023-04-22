import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementRuleService } from "./rule.service";
import { AchievementRuleEntity } from "./rule.entity";

@ApiBearerAuth()
@Controller("/achievements/rules")
export class AchievementRuleController {
  constructor(private readonly achievementRuleService: AchievementRuleService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@User() userEntity: UserEntity): Promise<[Array<AchievementRuleEntity>, number]> {
    return this.achievementRuleService.search(userEntity);
  }
}
