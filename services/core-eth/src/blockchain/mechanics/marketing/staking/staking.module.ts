import { Module } from "@nestjs/common";

import { StakingContractModule } from "./contract/contract.module";
import { StakingRulesModule } from "./rules/rules.module";
import { StakingDepositModule } from "./deposit/deposit.module";

@Module({
  imports: [StakingContractModule, StakingRulesModule, StakingDepositModule],
})
export class StakingModule {}
