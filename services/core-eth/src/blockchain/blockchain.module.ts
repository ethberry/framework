import { Module } from "@nestjs/common";

import { ContractManagerModule } from "./contract-manager/contract-manager.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { ExtensionsModule } from "./extensions/extensions.module";
import { HierarchyModule } from "./hierarchy/hierarchy.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { MechanicsModule } from "./mechanics/mechanics.module";
import { TokensModule } from "./tokens/tokens.module";
import { TransactionModule } from "./transaction/transaction.module";

@Module({
  imports: [
    ContractManagerModule,
    ExchangeModule,
    ExtensionsModule,
    HierarchyModule,
    IntegrationsModule,
    MechanicsModule,
    TokensModule,
    TransactionModule,
  ],
})
export class BlockchainModule {}
