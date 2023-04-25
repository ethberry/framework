import { Module } from "@nestjs/common";

import { MarketplaceModule } from "./marketplace/marketplace.module";
import { AssetModule } from "./asset/asset.module";

@Module({
  imports: [MarketplaceModule, AssetModule],
})
export class ExchangeModule {}
