import { Module } from "@nestjs/common";

import { StakingRulesModule } from "./staking-rules/staking-rules.module";
import { StakesModule } from "./stakes/stakes.module";

@Module({
  imports: [StakesModule, StakingRulesModule],
})
export class StakingModule {}
