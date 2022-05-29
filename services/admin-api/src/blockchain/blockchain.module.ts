import { Module } from "@nestjs/common";

import { ContractManagerModule } from "./contract-manager/contract-manager.module";
import { AccessControlModule } from "./access-control/access-control.module";

@Module({
  imports: [ContractManagerModule, AccessControlModule],
})
export class BlockchainModule {}
