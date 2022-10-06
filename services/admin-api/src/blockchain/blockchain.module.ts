import { Module } from "@nestjs/common";

import { ContractManagerModule } from "./contract-manager/contract-manager.module";
import { AccessControlModule } from "./access-control/access-control.module";
import { AccessListModule } from "./access-list/access-list.module";
import { HierarchyModule } from "./hierarchy/hierarchy.module";
import { MechanicsModule } from "./mechanics/mechanics.module";
import { TokensModule } from "./tokens/tokens.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { ContractHistoryModule } from "./contract-history/contract-history.module";

@Module({
  imports: [
    ContractManagerModule,
    ContractHistoryModule,
    AccessControlModule,
    AccessListModule,
    HierarchyModule,
    TokensModule,
    MechanicsModule,
    IntegrationsModule,
  ],
})
export class BlockchainModule {}
