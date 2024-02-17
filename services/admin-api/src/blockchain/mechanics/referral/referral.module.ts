import { Module } from "@nestjs/common";

import { ReferralRewardModule } from "./reward/referral.reward.module";
import { ReferralProgramModule } from "./program/referral.program.module";
import { ReferralLeaderboardModule } from "./leaderboard/leaderboard.module";
import { ReferralReportModule } from "./report/report.module";

@Module({
  imports: [ReferralProgramModule, ReferralRewardModule, ReferralLeaderboardModule, ReferralReportModule],
})
export class ReferralModule {}
