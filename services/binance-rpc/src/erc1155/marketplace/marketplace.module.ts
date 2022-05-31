import { Logger, Module } from "@nestjs/common";

import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { Erc1155MarketplaceHistoryModule } from "../marketplace-history/marketplace-history.module";
import { Erc1155TokenModule } from "../token/token.module";
import { Erc1155MarketplaceServiceEth } from "./marketplace.service.eth";
import { Erc1155MarketplaceControllerEth } from "./marketplace.controller.eth";

@Module({
  imports: [ContractManagerModule, Erc1155TokenModule, Erc1155MarketplaceHistoryModule],
  providers: [Logger, Erc1155MarketplaceServiceEth],
  controllers: [Erc1155MarketplaceControllerEth],
  exports: [Erc1155MarketplaceServiceEth],
})
export class Erc1155MarketplaceModule {}
