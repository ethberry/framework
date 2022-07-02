import { Logger, Module } from "@nestjs/common";

import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";

import { Erc998MarketplaceServiceEth } from "./marketplace.service.eth";
import { Erc998MarketplaceControllerEth } from "./marketplace.controller.eth";
import { Erc998MarketplaceHistoryModule } from "./marketplace-history/marketplace-history.module";
import { Erc998MarketplaceLogModule } from "./marketplace-log/marketplace-log.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";

@Module({
  imports: [
    ContractManagerModule,
    Erc998MarketplaceLogModule,
    Erc998MarketplaceHistoryModule,
    TokenModule,
    TemplateModule,
  ],
  providers: [Logger, Erc998MarketplaceServiceEth],
  controllers: [Erc998MarketplaceControllerEth],
  exports: [Erc998MarketplaceServiceEth],
})
export class Erc998MarketplaceModule {}
