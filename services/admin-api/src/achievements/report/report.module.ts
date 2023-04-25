import { Module } from "@nestjs/common";

import { AchievementReportService } from "./report.service";
import { AchievementReportController } from "./report.controller";
import { AchievementItemModule } from "../item/item.module";

@Module({
  imports: [AchievementItemModule],
  providers: [AchievementReportService],
  controllers: [AchievementReportController],
  exports: [AchievementReportService],
})
export class AchievementReportModule {}
