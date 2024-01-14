import { Module } from "@nestjs/common";

import { ReferralLeaderboardModule } from "./leaderboard/leaderboard.module";
import { ReferralRewardModule } from "./reward/reward.module";
import { ReferralReportModule } from "./report/report.module";

@Module({
  imports: [ReferralRewardModule, ReferralLeaderboardModule, ReferralReportModule],
})
export class ReferralModule {}
