import { Module } from "@nestjs/common";

import { PyramidLeaderboardService } from "./leaderboard.service";
import { PyramidLeaderboardController } from "./leaderboard.controller";
import { PyramidDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [PyramidDepositModule],
  providers: [PyramidLeaderboardService],
  controllers: [PyramidLeaderboardController],
  exports: [PyramidLeaderboardService],
})
export class PyramidLeaderboardModule {}
