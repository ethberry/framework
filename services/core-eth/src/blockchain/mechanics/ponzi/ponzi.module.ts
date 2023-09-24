import { Module } from "@nestjs/common";

import { PonziLogModule } from "./log/log.module";
import { PonziRulesModule } from "./rules/rules.module";
import { PonziDepositModule } from "./deposit/deposit.module";

@Module({
  imports: [PonziLogModule, PonziRulesModule, PonziDepositModule],
})
export class PonziModule {}
