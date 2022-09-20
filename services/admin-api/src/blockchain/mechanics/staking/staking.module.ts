import { Module } from "@nestjs/common";

import { StakingRulesModule } from "./rules/rules.module";
import { StakingDepositModule } from "./deposit/deposit.module";
import { StakingReportModule } from "./report/report.module";
import { StakingChartModule } from "./chart/chart.module";

@Module({
  imports: [StakingRulesModule, StakingDepositModule, StakingReportModule, StakingChartModule],
})
export class StakingModule {}
