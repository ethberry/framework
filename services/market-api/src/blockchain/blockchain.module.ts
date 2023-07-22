import { Module } from "@nestjs/common";

import { EventHistoryModule } from "./event-history/event-history.module";
import { ExchangeModule } from "./exchange/exchange.module";
import { ExtensionsModule } from "./extensions/extensions.module";
import { HierarchyModule } from "./hierarchy/hierarchy.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { MechanicsModule } from "./mechanics/mechanics.module";
import { TokensModule } from "./tokens/tokens.module";

@Module({
  imports: [
    EventHistoryModule,
    ExchangeModule,
    ExtensionsModule,
    HierarchyModule,
    IntegrationsModule,
    MechanicsModule,
    TokensModule,
  ],
})
export class BlockchainModule {}
