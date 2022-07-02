import { Logger, Module } from "@nestjs/common";

import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";

import { Erc721MarketplaceServiceEth } from "./marketplace.service.eth";
import { Erc721MarketplaceControllerEth } from "./marketplace.controller.eth";
import { Erc721MarketplaceHistoryModule } from "./marketplace-history/marketplace-history.module";
import { Erc721MarketplaceLogModule } from "./marketplace-log/marketplace-log.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";

@Module({
  imports: [
    ContractManagerModule,
    Erc721MarketplaceLogModule,
    Erc721MarketplaceHistoryModule,
    TokenModule,
    TemplateModule,
  ],
  providers: [Logger, Erc721MarketplaceServiceEth],
  controllers: [Erc721MarketplaceControllerEth],
  exports: [Erc721MarketplaceServiceEth],
})
export class Erc721MarketplaceModule {}
