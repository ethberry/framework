import { Logger, Module } from "@nestjs/common";

import { Erc721TokenModule } from "../token/token.module";
import { Erc721TemplateModule } from "../template/template.module";
import { Erc721MarketplaceServiceWs } from "./marketplace.service.ws";
import { Erc721MarketplaceControllerWs } from "./marketplace.controller.ws";
import { Erc721MarketplaceHistoryModule } from "../marketplace-history/marketplace-history.module";
import { Erc721DropboxModule } from "../dropbox/dropbox.module";

@Module({
  imports: [Erc721MarketplaceHistoryModule, Erc721TokenModule, Erc721DropboxModule, Erc721TemplateModule],
  providers: [Logger, Erc721MarketplaceServiceWs],
  controllers: [Erc721MarketplaceControllerWs],
  exports: [Erc721MarketplaceServiceWs],
})
export class Erc721MarketplaceModule {}
