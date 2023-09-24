import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { DismantleModule } from "../../mechanics/recipes/dismantle/dismantle.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeDismantleControllerEth } from "./dismantle.controller.eth";
import { ExchangeDismantleServiceEth } from "./dismantle.service.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, EventHistoryModule, AssetModule, NotificatorModule, DismantleModule],
  providers: [signalServiceProvider, Logger, ExchangeDismantleServiceEth],
  controllers: [ExchangeDismantleControllerEth],
  exports: [ExchangeDismantleServiceEth],
})
export class ExchangeDismantleModule {}
