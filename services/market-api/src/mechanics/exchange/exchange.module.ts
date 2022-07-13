import { Module } from "@nestjs/common";

import { ExchangeRulesModule } from "./exchange-rules/exchange-rules.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [ExchangeRulesModule, MarketplaceModule],
})
export class ExchangeModule {}
