import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { Erc721DropboxModule } from "../dropbox/dropbox.module";
import { Erc721TemplateModule } from "../template/template.module";
import { Erc721MarketplaceService } from "./marketplace.service";
import { Erc721MarketplaceController } from "./marketplace.controller";

@Module({
  imports: [ConfigModule, Erc721TemplateModule, Erc721DropboxModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, Erc721MarketplaceService],
  controllers: [Erc721MarketplaceController],
  exports: [Erc721MarketplaceService],
})
export class Erc721MarketplaceModule {}
