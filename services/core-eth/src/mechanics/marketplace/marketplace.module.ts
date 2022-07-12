import { Logger, Module } from "@nestjs/common";

import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { MarketplaceHistoryModule } from "./marketplace-history/marketplace-history.module";
import { MarketplaceServiceEth } from "./marketplace.service.eth";
import { MarketplaceControllerEth } from "./marketplace.controller.eth";
import { MarketplaceLogModule } from "./marketplace-log/marketplace.log.module";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";

@Module({
  imports: [ContractManagerModule, TokenModule, MarketplaceHistoryModule, MarketplaceLogModule],
  providers: [Logger, MarketplaceServiceEth],
  controllers: [MarketplaceControllerEth],
  exports: [MarketplaceServiceEth],
})
export class MarketplaceModule {}
