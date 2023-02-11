import { Module } from "@nestjs/common";

import { ContractManagerModuleEth } from "./contract-manager/contract-manager.module.eth";
import { TokensModule } from "./tokens/tokens.module";
import { MechanicsModule } from "./mechanics/mechanics.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { ExtensionsModule } from "./extensions/extensions.module";
import { IntegrationsModule } from "./integrations/integrations.module";

@Module({
  imports: [
    ContractManagerModuleEth,
    TokensModule,
    MechanicsModule,
    ExchangeModule,
    ExtensionsModule,
    IntegrationsModule,
  ],
})
export class BlockchainModule {}
