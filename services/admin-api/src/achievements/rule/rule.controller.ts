import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AchievementRuleService } from "./rule.service";
import { AchievementRuleEntity } from "./rule.entity";

@ApiBearerAuth()
@Controller("/achievements/rules")
export class AchievementRuleController {
  constructor(private readonly achievementRuleService: AchievementRuleService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<AchievementRuleEntity>> {
    return this.achievementRuleService.autocomplete();
  }
}
