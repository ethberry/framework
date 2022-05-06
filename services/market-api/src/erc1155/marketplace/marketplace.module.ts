import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { Erc1155MarketplaceService } from "./marketplace.service";
import { Erc1155TokenModule } from "../token/token.module";
import { Erc1155MarketplaceController } from "./marketplace.controller";

@Module({
  imports: [ConfigModule, Erc1155TokenModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, Erc1155MarketplaceService],
  controllers: [Erc1155MarketplaceController],
  exports: [Erc1155MarketplaceService],
})
export class Erc1155MarketplaceModule {}
