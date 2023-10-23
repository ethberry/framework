import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { MergeModule } from "../../mechanics/recipes/merge/merge.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeMergeControllerEth } from "./merge.controller.eth";
import { ExchangeMergeServiceEth } from "./merge.service.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, EventHistoryModule, AssetModule, NotificatorModule, MergeModule],
  providers: [signalServiceProvider, Logger, ExchangeMergeServiceEth],
  controllers: [ExchangeMergeControllerEth],
  exports: [ExchangeMergeServiceEth],
})
export class ExchangeMergeModule {}
