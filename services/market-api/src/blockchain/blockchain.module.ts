import { Module } from "@nestjs/common";

import { ExchangeModule } from "./exchange/exchange.module";
import { HierarchyModule } from "./hierarchy/hierarchy.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { MechanicsModule } from "./mechanics/mechanics.module";
import { TokensModule } from "./tokens/tokens.module";

@Module({
  imports: [ExchangeModule, HierarchyModule, IntegrationsModule, MechanicsModule, TokensModule],
})
export class BlockchainModule {}
