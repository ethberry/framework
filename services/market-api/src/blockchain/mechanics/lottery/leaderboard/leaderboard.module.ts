import { Module } from "@nestjs/common";

import { LotteryLeaderboardService } from "./leaderboard.service";
import { LotteryLeaderboardController } from "./leaderboard.controller";
import { LotteryTokenModule } from "../token/token.module";

@Module({
  imports: [LotteryTokenModule],
  providers: [LotteryLeaderboardService],
  controllers: [LotteryLeaderboardController],
  exports: [LotteryLeaderboardService],
})
export class LotteryLeaderboardModule {}
