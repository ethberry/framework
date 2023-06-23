import { Module } from "@nestjs/common";

import { LotteryLeaderboardModule } from "./leaderboard/leaderboard.module";
import { LotterySignModule } from "./sign/sign.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryTicketModule } from "./token/ticket.module";

@Module({
  imports: [LotteryRoundModule, LotteryTicketModule, LotterySignModule, LotteryLeaderboardModule],
})
export class LotteryModule {}
