import { Module } from "@nestjs/common";

import { RaffleLeaderboardService } from "./leaderboard.service";
import { RaffleLeaderboardController } from "./leaderboard.controller";
import { RaffleTicketModule } from "../token/ticket.module";

@Module({
  imports: [RaffleTicketModule],
  providers: [RaffleLeaderboardService],
  controllers: [RaffleLeaderboardController],
  exports: [RaffleLeaderboardService],
})
export class RaffleLeaderboardModule {}
