import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { DropboxModule } from "../../blockchain/dropbox/dropbox.module";
import { Erc721TemplateModule } from "../template/template.module";
import { Erc721MarketplaceService } from "./marketplace.service";
import { Erc721MarketplaceController } from "./marketplace.controller";

@Module({
  imports: [ConfigModule, Erc721TemplateModule, DropboxModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, Erc721MarketplaceService],
  controllers: [Erc721MarketplaceController],
  exports: [Erc721MarketplaceService],
})
export class Erc721MarketplaceModule {}
