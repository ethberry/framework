import { Module } from "@nestjs/common";

import { StakingRulesModule } from "./staking-rules/staking-rules.module";
import { StakingStakesModule } from "./staking-stakes/staking-stakes.module";

@Module({
  imports: [StakingStakesModule, StakingRulesModule],
})
export class StakingModule {}
