import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ChainLinkControllerEth } from "./chain-link.controller.eth";
import { ChainLinkServiceEth } from "./chain-link.service.eth";
import { emlServiceProvider } from "../../../common/providers";
import { ChainLinkLogModule } from "./log/log.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ChainLinkServiceCron } from "./chain-link.service.cron";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [ConfigModule, ContractModule, ChainLinkLogModule, EventHistoryModule],
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
