import { Module } from "@nestjs/common";

import { AchievementItemModule } from "./item/item.module";
import { AchievementRuleModule } from "./rule/rule.module";
import { AchievementLevelModule } from "./level/level.module";

@Module({
  imports: [AchievementRuleModule, AchievementLevelModule, AchievementItemModule],
})
export class AchievementModule {}
