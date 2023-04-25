import { Module } from "@nestjs/common";

import { AchievementItemModule } from "./item/item.module";
import { AchievementRuleModule } from "./rule/rule.module";

@Module({
  imports: [AchievementRuleModule, AchievementItemModule],
})
export class AchievementModule {}
