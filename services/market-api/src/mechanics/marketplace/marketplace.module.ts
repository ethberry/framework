import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { DropboxModule } from "../dropbox/dropbox.module";
import { MarketplaceService } from "./marketplace.service";
import { Erc721MarketplaceController } from "./marketplace.controller";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";

@Module({
  imports: [ConfigModule, TemplateModule, DropboxModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, MarketplaceService],
  controllers: [Erc721MarketplaceController],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
