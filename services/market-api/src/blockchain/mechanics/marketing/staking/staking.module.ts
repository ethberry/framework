import { Module } from "@nestjs/common";

import { StakingRulesModule } from "./rules/rules.module";
import { StakingDepositModule } from "./deposit/deposit.module";
import { StakingLeaderboardModule } from "./leaderboard/leaderboard.module";

@Module({
  imports: [StakingDepositModule, StakingRulesModule, StakingLeaderboardModule],
})
export class StakingModule {}
