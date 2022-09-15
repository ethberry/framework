import { Module } from "@nestjs/common";

import { PyramidContractModule } from "./contract/contract.module";
import { PyramidReportModule } from "./report/report.module";
import { PyramidRulesModule } from "./rules/rules.module";
import { PyramidDepositModule } from "./deposit/deposit.module";
import { PyramidChartModule } from "./chart/chart.module";

@Module({
  imports: [PyramidContractModule, PyramidReportModule, PyramidRulesModule, PyramidDepositModule, PyramidChartModule],
})
export class PyramidModule {}
