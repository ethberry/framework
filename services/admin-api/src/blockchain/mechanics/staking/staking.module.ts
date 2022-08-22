import { Module } from "@nestjs/common";

import { StakingRulesModule } from "./rules/rules.module";
import { StakingStakesModule } from "./stakes/stakes.module";
import { StakingReportModule } from "./report/report.module";

@Module({
  imports: [StakingRulesModule, StakingStakesModule, StakingReportModule],
})
export class StakingModule {}
