import { Module } from "@nestjs/common";

import { StakingRulesModule } from "./rules/rules.module";
import { StakingStakesModule } from "./stakes/stakes.module";
import { StakingLeaderboardModule } from "./leaderboard/leaderboard.module";

@Module({
  imports: [StakingStakesModule, StakingRulesModule, StakingLeaderboardModule],
})
export class StakingModule {}
