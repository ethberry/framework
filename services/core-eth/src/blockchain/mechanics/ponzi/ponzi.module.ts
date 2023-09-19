import { Module } from "@nestjs/common";

import { PonziLogModule } from "./log/log.module";
import { PonziContractModule } from "./contract/contract.module";
import { PonziRulesModule } from "./rules/rules.module";
import { PonziDepositModule } from "./deposit/deposit.module";

@Module({
  imports: [PonziLogModule, PonziContractModule, PonziRulesModule, PonziDepositModule],
})
export class PonziModule {}
