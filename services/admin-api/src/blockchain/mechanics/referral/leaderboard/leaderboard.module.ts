import { Module } from "@nestjs/common";

import { ReferralLeaderboardService } from "./leaderboard.service";
import { ReferralLeaderboardController } from "./leaderboard.controller";
import { ReferralRewardModule } from "../reward/reward.module";

@Module({
  imports: [ReferralRewardModule],
  providers: [ReferralLeaderboardService],
  controllers: [ReferralLeaderboardController],
  exports: [ReferralLeaderboardService],
})
export class ReferralLeaderboardModule {}
