import { Module } from "@nestjs/common";

import { PyramidContractModule } from "./contract/contract.module";
import { PyramidReportModule } from "./report/report.module";
import { PyramidRulesModule } from "./rules/rules.module";
import { PyramidStakesModule } from "./stakes/stakes.module";

@Module({
  imports: [PyramidContractModule, PyramidReportModule, PyramidRulesModule, PyramidStakesModule],
})
export class PyramidModule {}
