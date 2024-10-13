import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../../common/providers";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { ChainLinkConsumerControllerEth } from "./consumer.controller.eth";
import { ChainLinkConsumerServiceEth } from "./consumer.service.eth";
import { ChainLinkConsumerServiceLog } from "./consumer.service.log";

@Module({
  imports: [ConfigModule, ContractModule, EventHistoryModule, AssetModule, TokenModule, EthersModule.deferred()],
  providers: [signalServiceProvider, ChainLinkConsumerServiceLog, ChainLinkConsumerServiceEth],
  controllers: [ChainLinkConsumerControllerEth],
  exports: [ChainLinkConsumerServiceLog, ChainLinkConsumerServiceEth],
})
export class ChainLinkConsumerGenesModule implements OnModuleInit {
  constructor(protected readonly chainLinkConsumerServiceLog: ChainLinkConsumerServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.chainLinkConsumerServiceLog.initRegistry();
  }
}
