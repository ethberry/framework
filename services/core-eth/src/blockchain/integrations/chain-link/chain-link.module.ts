import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ChainLinkControllerEth } from "./chain-link.controller.eth";
import { ChainLinkServiceEth } from "./chain-link.service.eth";
import { emlServiceProvider } from "../../../common/providers";
import { ChainLinkLogModule } from "./log/log.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { ChainLinkServiceCron } from "./chain-link.service.cron";

@Module({
  imports: [ConfigModule, ContractModule, ChainLinkLogModule, TokenModule],
  providers: [
    Logger,
    ethersRpcProvider,
    emlServiceProvider,
    ethersSignerProvider,
    ChainLinkServiceEth,
    ChainLinkServiceCron,
  ],
  controllers: [ChainLinkControllerEth],
  exports: [ChainLinkServiceEth],
})
export class ChainLinkModule {}
