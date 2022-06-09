import { Logger, Module } from "@nestjs/common";

import { StakingControllerEth } from "./staking.controller.eth";
import { StakingServiceEth } from "./staking.service.eth";
import { StakingHistoryModule } from "./staking-history/staking-history.module";
import { ContractManagerModule } from "../contract-manager/contract-manager.module";

@Module({
  imports: [StakingHistoryModule, ContractManagerModule],
  providers: [Logger, StakingServiceEth],
  controllers: [StakingControllerEth],
  exports: [StakingServiceEth],
})
export class StakingModule {}
