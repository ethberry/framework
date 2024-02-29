import { Module } from "@nestjs/common";

import { StakingRulesModule } from "./rules/rules.module";
import { StakingDepositModule } from "./deposit/deposit.module";
import { StakingReportModule } from "./report/report.module";
import { StakingChartModule } from "./chart/chart.module";
import { StakingContractModule } from "./contract/contract.module";
import { StakingPenaltyModule } from "./penalty/penalty.module";

@Module({
  imports: [
    StakingContractModule,
    StakingRulesModule,
    StakingDepositModule,
    StakingReportModule,
    StakingChartModule,
    StakingPenaltyModule,
  ],
})
export class StakingModule {}
