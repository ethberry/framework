import { Module } from "@nestjs/common";

import { AchievementRuleModule } from "./rule/rule.module";
import { AchievementItemModule } from "./item/item.module";
import { AchievementLevelModule } from "./level/level.module";
import { AchievementsSignModule } from "./sign/sign.module";

@Module({
  imports: [AchievementRuleModule, AchievementItemModule, AchievementLevelModule, AchievementsSignModule],
})
export class AchievementModule {}
