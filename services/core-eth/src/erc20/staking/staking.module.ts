import { Logger, Module } from "@nestjs/common";

import { Erc20StakingControllerEth } from "./staking.controller.eth";
import { Erc20StakingServiceEth } from "./staking.service.eth";
import { Erc20StakingHistoryModule } from "./staking-history/staking-history.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";

@Module({
  imports: [Erc20StakingHistoryModule, ContractManagerModule],
  providers: [Logger, Erc20StakingServiceEth],
  controllers: [Erc20StakingControllerEth],
  exports: [Erc20StakingServiceEth],
})
export class Erc20StakingModule {}
