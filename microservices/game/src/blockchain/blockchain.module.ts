import { Module } from "@nestjs/common";

import { ExchangeModule } from "./exchange/exchange.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { MechanicsModule } from "./mechanics/mechanics.module";

@Module({
  imports: [ExchangeModule, IntegrationsModule, MechanicsModule],
})
export class BlockchainModule {}
