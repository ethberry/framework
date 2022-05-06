import { Logger, Module } from "@nestjs/common";

import { Erc1155MarketplaceHistoryModule } from "../marketplace-history/marketplace-history.module";
import { Erc1155TokenModule } from "../token/token.module";
import { Erc1155MarketplaceServiceWs } from "./marketplace.service.ws";
import { Erc1155MarketplaceControllerWs } from "./marketplace.controller.ws";

@Module({
  imports: [Erc1155TokenModule, Erc1155MarketplaceHistoryModule],
  providers: [Logger, Erc1155MarketplaceServiceWs],
  controllers: [Erc1155MarketplaceControllerWs],
  exports: [Erc1155MarketplaceServiceWs],
})
export class Erc1155MarketplaceModule {}
