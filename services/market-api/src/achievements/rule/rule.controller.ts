import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { AchievementRuleService } from "./rule.service";
import { AchievementRuleEntity } from "./rule.entity";

@ApiBearerAuth()
@Controller("/achievements/rules")
export class AchievementRuleController {
  constructor(private readonly achievementRuleService: AchievementRuleService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<AchievementRuleEntity>, number]> {
    return this.achievementRuleService.search();
  }
}
