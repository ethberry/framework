import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementRuleEntity } from "./rule.entity";
import { AchievementsRuleService } from "./rule.service";

@Module({
  imports: [TypeOrmModule.forFeature([AchievementRuleEntity])],
  providers: [AchievementsRuleService],
  exports: [AchievementsRuleService],
})
export class AchievementRuleModule {}
