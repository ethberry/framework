import { Module } from "@nestjs/common";

import { ContractManagerModule } from "./contract-manager/contract-manager.module";
import { ContractManagerModuleEth } from "./contract-manager/contract-manager.module.eth";
import { AccessControlModule } from "./access-control/access-control.module";

@Module({
  imports: [ContractManagerModule, ContractManagerModuleEth, AccessControlModule],
})
export class BlockchainModule {}
