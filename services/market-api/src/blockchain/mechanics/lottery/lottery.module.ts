import { Module } from "@nestjs/common";

import { LotteryLeaderboardModule } from "./leaderboard/leaderboard.module";
import { LotterySignModule } from "./sign/sign.module";

@Module({
  imports: [LotterySignModule, LotteryLeaderboardModule],
})
export class LotteryModule {}
