import { Module } from "@nestjs/common";

import { ChainLinkModule } from "./chain-link/chain-link.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";

@Module({
  imports: [ChainLinkModule, MarketplaceModule],
})
export class IntegrationsModule {}
