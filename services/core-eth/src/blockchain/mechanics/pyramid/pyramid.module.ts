import { Module } from "@nestjs/common";

import { PyramidRulesModule } from "./rules/rules.module";
import { PyramidDepositModule } from "./deposit/deposit.module";

@Module({
  imports: [PyramidRulesModule, PyramidDepositModule],
})
export class PyramidModule {}
