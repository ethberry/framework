import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { Erc998DropboxModule } from "../dropbox/dropbox.module";
import { Erc998TemplateModule } from "../template/template.module";
import { Erc998MarketplaceService } from "./marketplace.service";
import { Erc998MarketplaceController } from "./marketplace.controller";

@Module({
  imports: [ConfigModule, Erc998TemplateModule, Erc998DropboxModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, Erc998MarketplaceService],
  controllers: [Erc998MarketplaceController],
  exports: [Erc998MarketplaceService],
})
export class Erc998MarketplaceModule {}
