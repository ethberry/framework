import { Module } from "@nestjs/common";

import { AchievementRuleModule } from "./rule/rule.module";
import { AchievementLevelModule } from "./level/level.module";
import { AchievementItemModule } from "./item/item.module";
import { AchievementReportModule } from "./report/report.module";

@Module({
  imports: [AchievementRuleModule, AchievementLevelModule, AchievementItemModule, AchievementReportModule],
})
export class AchievementModule {}
