import { Module } from "@nestjs/common";

import { PyramidRulesModule } from "./rules/rules.module";
import { PyramidDepositModule } from "./deposit/deposit.module";
import { PyramidLeaderboardModule } from "./leaderboard/leaderboard.module";

@Module({
  imports: [PyramidDepositModule, PyramidRulesModule, PyramidLeaderboardModule],
})
export class PyramidModule {}
