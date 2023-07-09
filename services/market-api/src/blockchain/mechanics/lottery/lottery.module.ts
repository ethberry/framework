import { Module } from "@nestjs/common";

import { LotteryLeaderboardModule } from "./leaderboard/leaderboard.module";
import { LotterySignModule } from "./sign/sign.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryTokenModule } from "./token/token.module";
import { LotteryContractModule } from "./contract/lottery.module";

@Module({
  imports: [LotteryContractModule, LotteryRoundModule, LotteryTokenModule, LotterySignModule, LotteryLeaderboardModule],
})
export class LotteryModule {}
