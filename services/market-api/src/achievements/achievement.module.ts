import { Module } from "@nestjs/common";

import { AchievementRuleModule } from "./rule/rule.module";
import { AchievementItemModule } from "./item/item.module";

@Module({
  imports: [AchievementRuleModule, AchievementItemModule],
})
export class AchievementModule {}
