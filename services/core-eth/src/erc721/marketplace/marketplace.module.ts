import { Logger, Module } from "@nestjs/common";

import { Erc721TokenModule } from "../token/token.module";
import { Erc721DropboxModule } from "../dropbox/dropbox.module";
import { Erc721TemplateModule } from "../template/template.module";
import { Erc721MarketplaceServiceEth } from "./marketplace.service.eth";
import { Erc721MarketplaceControllerEth } from "./marketplace.controller.eth";
import { Erc721MarketplaceHistoryModule } from "./marketplace-history/marketplace-history.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";

@Module({
  imports: [
    ContractManagerModule,
    Erc721MarketplaceHistoryModule,
    Erc721TokenModule,
    Erc721DropboxModule,
    Erc721TemplateModule,
  ],
  providers: [Logger, Erc721MarketplaceServiceEth],
  controllers: [Erc721MarketplaceControllerEth],
  exports: [Erc721MarketplaceServiceEth],
})
export class Erc721MarketplaceModule {}
