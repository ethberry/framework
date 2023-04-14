import { Module } from "@nestjs/common";

import { AchievementRuleModule } from "./rule/rule.module";
import { AchievementLevelModule } from "./level/level.module";
import { AchievementItemModule } from "./item/item.module";

@Module({
  imports: [AchievementRuleModule, AchievementLevelModule, AchievementItemModule],
})
export class AchievementModule {}
