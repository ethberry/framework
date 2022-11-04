import { Module } from "@nestjs/common";

import { CoinMarketCapModule } from "@gemunion/nest-js-module-coin-market-cap";
import { CoinGeckoModule } from "@gemunion/nest-js-module-coin-gecko";

import { ChainLinkModule } from "./chain-link/chain-link.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [CoinMarketCapModule, CoinGeckoModule, ChainLinkModule, MarketplaceModule],
})
export class IntegrationsModule {}
