import { Module } from "@nestjs/common";

import { RaffleLeaderboardService } from "./leaderboard.service";
import { RaffleLeaderboardController } from "./leaderboard.controller";
import { RaffleTokenModule } from "../token/token.module";

@Module({
  imports: [RaffleTokenModule],
  providers: [RaffleLeaderboardService],
  controllers: [RaffleLeaderboardController],
  exports: [RaffleLeaderboardService],
})
export class RaffleLeaderboardModule {}
