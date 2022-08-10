import { Module } from "@nestjs/common";

import { ReferralLeaderboardModule } from "./leaderboard/leaderboard.module";
import { ReferralRewardModule } from "./reward/reward.module";

@Module({
  imports: [ReferralRewardModule, ReferralLeaderboardModule],
})
export class ReferralModule {}
