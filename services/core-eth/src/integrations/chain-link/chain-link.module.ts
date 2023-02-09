import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ChainLinkControllerEth } from "./chain-link.controller.eth";
import { ChainLinkServiceEth } from "./chain-link.service.eth";

@Module({
  imports: [ConfigModule],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, ChainLinkServiceEth],
  controllers: [ChainLinkControllerEth],
  exports: [ChainLinkServiceEth],
})
export class ChainLinkModule {}
