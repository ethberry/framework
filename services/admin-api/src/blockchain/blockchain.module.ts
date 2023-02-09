import { Module } from "@nestjs/common";

import { ContractManagerModule } from "./contract-manager/contract-manager.module";
import { HierarchyModule } from "./hierarchy/hierarchy.module";
import { MechanicsModule } from "./mechanics/mechanics.module";
import { TokensModule } from "./tokens/tokens.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { EthLoggerModule } from "./eth-logger/eth-logger.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { ExtensionsModule } from "./extensions/extensions.module";

@Module({
  imports: [
    ContractManagerModule,
    HierarchyModule,
    TokensModule,
    MechanicsModule,
    IntegrationsModule,
    ExchangeModule,
    EthLoggerModule,
    ExtensionsModule,
  ],
})
export class BlockchainModule {}
