import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeRaffleServiceEth } from "./raffle.service.eth";
import { ExchangeRaffleControllerEth } from "./raffle.controller.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, EventHistoryModule, AssetModule, TemplateModule, NotificatorModule],
  providers: [signalServiceProvider, ExchangeRaffleServiceEth],
  controllers: [ExchangeRaffleControllerEth],
  exports: [ExchangeRaffleServiceEth],
})
export class ExchangeRaffleModule {}
