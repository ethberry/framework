import { Module } from "@nestjs/common";

import { ContractManagerModule } from "./contract-manager/contract-manager.module";
import { ContractManagerModuleEth } from "./contract-manager/contract-manager.module.eth";
import { AccessControlModule } from "./access-control/access-control.module";
import { ContractHistoryModule } from "./contract-history/contract-history.module";

@Module({
  imports: [ContractManagerModule, ContractManagerModuleEth, ContractHistoryModule, AccessControlModule],
})
export class BlockchainModule {}
