import { Module } from "@nestjs/common";

import { ReferralLeaderboardModule } from "./leaderboard/leaderboard.module";
import { ReferralRewardModule } from "./reward/reward.module";
import { ReferralReportModule } from "./report/report.module";
import { ReferralProgramModule } from "./program/referral.program.module";
import { ReferralClaimModule } from "./claim/referral.claim.module";
//
@Module({
  imports: [
    ReferralRewardModule,
    ReferralLeaderboardModule,
    ReferralReportModule,
    ReferralProgramModule,
    ReferralClaimModule,
  ],
})
export class ReferralModule {}
