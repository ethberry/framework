import { Module } from "@nestjs/common";

import { PonziContractModule } from "./contract/contract.module";
import { PonziReportModule } from "./report/report.module";
import { PonziRulesModule } from "./rules/rules.module";
import { PonziDepositModule } from "./deposit/deposit.module";
import { PonziChartModule } from "./chart/chart.module";

@Module({
  imports: [PonziContractModule, PonziReportModule, PonziRulesModule, PonziDepositModule, PonziChartModule],
})
export class PonziModule {}
