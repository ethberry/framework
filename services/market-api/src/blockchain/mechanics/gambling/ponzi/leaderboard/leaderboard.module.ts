import { Module } from "@nestjs/common";

import { PonziLeaderboardService } from "./leaderboard.service";
import { PonziLeaderboardController } from "./leaderboard.controller";
import { PonziDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [PonziDepositModule],
  providers: [PonziLeaderboardService],
  controllers: [PonziLeaderboardController],
  exports: [PonziLeaderboardService],
})
export class PonziLeaderboardModule {}
