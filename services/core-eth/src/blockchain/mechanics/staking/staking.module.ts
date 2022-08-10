import { Module } from "@nestjs/common";

import { StakingRulesModule } from "./rules/rules.module";
import { StakingStakesModule } from "./staking-stakes/stakes.module";

@Module({
  imports: [StakingRulesModule, StakingStakesModule],
})
export class StakingModule {}
