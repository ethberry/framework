import { Module } from "@nestjs/common";

import { ContractManagerModule } from "./contract-manager/contract-manager.module";
import { AccessControlModule } from "./access-control/access-control.module";
import { AccessListModule } from "./access-list/access-list.module";
import { HierarchyModule } from "./hierarchy/hierarchy.module";

@Module({
  imports: [ContractManagerModule, AccessControlModule, AccessListModule, HierarchyModule],
})
export class BlockchainModule {}
