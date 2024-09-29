import { Module } from "@nestjs/common";

import { CoinMarketCapModule } from "@ethberry/nest-js-module-coin-market-cap";
import { CoinGeckoModule } from "@ethberry/nest-js-module-coin-gecko";
import { ChainLinkModule } from "./chain-link/chain-link.module";

@Module({
  imports: [CoinMarketCapModule, CoinGeckoModule, ChainLinkModule],
})
export class IntegrationsModule {}
