import { Module } from "@nestjs/common";

import { ContractManagerModule } from "./contract-manager/contract-manager.module";
import { AccessControlModule } from "./access-control/access-control.module";
import { AccessListModule } from "./access-list/access-list.module";
import { UniModule } from "./uni-token/uni.module";

@Module({
  imports: [ContractManagerModule, AccessControlModule, AccessListModule, UniModule],
})
export class BlockchainModule {}
