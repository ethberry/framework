import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementItemEntity } from "./item.entity";
import { AchievementsItemService } from "./item.service";
import { AchievementRuleModule } from "../rule/rule.module";

@Module({
  imports: [AchievementRuleModule, TypeOrmModule.forFeature([AchievementItemEntity])],
  providers: [AchievementsItemService],
  exports: [AchievementsItemService],
})
export class AchievementItemModule {}
