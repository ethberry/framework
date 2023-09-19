import { Module } from "@nestjs/common";

import { StakingLogModule } from "./log/log.module";
import { StakingContractModule } from "./contract/contract.module";
import { StakingRulesModule } from "./rules/rules.module";
import { StakingDepositModule } from "./deposit/deposit.module";

@Module({
  imports: [StakingLogModule, StakingContractModule, StakingRulesModule, StakingDepositModule],
})
export class StakingModule {}
