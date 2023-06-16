import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { emlServiceProvider } from "../../../common/providers";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ChainLinkControllerEth } from "./chain-link.controller.eth";
import { ChainLinkServiceEth } from "./chain-link.service.eth";
import { ChainLinkLogModule } from "./log/log.module";
import { ChainLinkServiceCron } from "./chain-link.service.cron";

@Module({
  imports: [ConfigModule, ContractModule, ChainLinkLogModule, EventHistoryModule],
  providers: [
    Logger,
    ethersRpcProvider,
    ethersSignerProvider,
    emlServiceProvider,
    ChainLinkServiceEth,
    ChainLinkServiceCron,
  ],
  controllers: [ChainLinkControllerEth],
  exports: [ChainLinkServiceEth],
})
export class ChainLinkModule {}
