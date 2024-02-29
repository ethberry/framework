import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { MysteryModule } from "../../mechanics/marketing/mystery/mystery.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeMysteryControllerEth } from "./mystery.controller.eth";
import { ExchangeMysteryServiceEth } from "./mystery.service.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [EventHistoryModule, MysteryModule, NotificatorModule, AssetModule, ConfigModule],
  providers: [signalServiceProvider, Logger, ExchangeMysteryServiceEth],
  controllers: [ExchangeMysteryControllerEth],
  exports: [ExchangeMysteryServiceEth],
})
export class ExchangeMysteryModule {}
