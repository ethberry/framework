import { Module } from "@nestjs/common";

import { StakingLeaderboardService } from "./leaderboard.service";
import { StakingLeaderboardController } from "./leaderboard.controller";
import { StakingDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [StakingDepositModule],
  providers: [StakingLeaderboardService],
  controllers: [StakingLeaderboardController],
  exports: [StakingLeaderboardService],
})
export class StakingLeaderboardModule {}
