import { Module } from "@nestjs/common";

import { PonziRulesModule } from "./rules/rules.module";
import { PonziDepositModule } from "./deposit/deposit.module";
import { PonziLeaderboardModule } from "./leaderboard/leaderboard.module";

@Module({
  imports: [PonziDepositModule, PonziRulesModule, PonziLeaderboardModule],
})
export class PonziModule {}
