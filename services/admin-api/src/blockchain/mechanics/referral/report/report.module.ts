import { Module } from "@nestjs/common";

import { ReferralReportService } from "./report.service";
import { ReferralReportController } from "./report.controller";
import { ReferralRewardModule } from "../reward/reward.module";

@Module({
  imports: [ReferralRewardModule],
  providers: [ReferralReportService],
  controllers: [ReferralReportController],
  exports: [ReferralReportService],
})
export class ReferralReportModule {}
