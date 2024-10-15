import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { CollectionControllerEth } from "./collection.controller.eth";
import { CollectionServiceEth } from "./collection.service.eth";
import { CollectionServiceLog } from "./collection.service.log";

@Module({
  imports: [ConfigModule, AssetModule, ContractModule, TokenModule, EventHistoryModule, EthersModule.deferred()],
  providers: [signalServiceProvider, Logger, CollectionServiceLog, CollectionServiceEth],
  controllers: [CollectionControllerEth],
  exports: [CollectionServiceLog, CollectionServiceEth],
})
export class CollectionModule {}
