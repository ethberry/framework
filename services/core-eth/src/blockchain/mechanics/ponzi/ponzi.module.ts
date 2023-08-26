import { Module } from "@nestjs/common";

import { PonziRulesModule } from "./rules/rules.module";
import { PonziDepositModule } from "./deposit/deposit.module";

@Module({
  imports: [PonziRulesModule, PonziDepositModule],
})
export class PonziModule {}
