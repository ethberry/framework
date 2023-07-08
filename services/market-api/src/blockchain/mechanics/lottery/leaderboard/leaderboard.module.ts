import { Module } from "@nestjs/common";

import { LotteryLeaderboardService } from "./leaderboard.service";
import { LotteryLeaderboardController } from "./leaderboard.controller";
import { LotteryTicketModule } from "../token/ticket.module";

@Module({
  imports: [LotteryTicketModule],
  providers: [LotteryLeaderboardService],
  controllers: [LotteryLeaderboardController],
  exports: [LotteryLeaderboardService],
})
export class LotteryLeaderboardModule {}
