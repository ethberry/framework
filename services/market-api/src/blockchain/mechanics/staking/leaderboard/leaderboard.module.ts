import { Module } from "@nestjs/common";

import { StakingLeaderboardService } from "./leaderboard.service";
import { StakingLeaderboardController } from "./leaderboard.controller";
import { StakingStakesModule } from "../stakes/stakes.module";

@Module({
  imports: [StakingStakesModule],
  providers: [StakingLeaderboardService],
  controllers: [StakingLeaderboardController],
  exports: [StakingLeaderboardService],
})
export class StakingLeaderboardModule {}
