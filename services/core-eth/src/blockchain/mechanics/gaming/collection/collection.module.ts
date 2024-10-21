import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { CollectionControllerEth } from "./collection.controller.eth";
import { CollectionServiceEth } from "./collection.service.eth";
import { CollectionServiceLog } from "./collection.service.log";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    ContractModule,
    TemplateModule,
    TokenModule,
    BalanceModule,
    EventHistoryModule,
    NotificatorModule,
    EthersModule.deferred(),
  ],
  providers: [signalServiceProvider, Logger, CollectionServiceLog, CollectionServiceEth],
  controllers: [CollectionControllerEth],
  exports: [CollectionServiceLog, CollectionServiceEth],
})
export class CollectionModule {}
