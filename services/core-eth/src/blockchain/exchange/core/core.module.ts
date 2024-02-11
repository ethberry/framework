import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeCoreControllerEth } from "./core.controller.eth";
import { ExchangeCoreServiceEth } from "./core.service.eth";
import { signalServiceProvider } from "../../../common/providers";
import { ReferralModule } from "../../mechanics/referral/referral.module";

@Module({
  imports: [ConfigModule, EventHistoryModule, NotificatorModule, AssetModule, ReferralModule],
  providers: [signalServiceProvider, ExchangeCoreServiceEth],
  controllers: [ExchangeCoreControllerEth],
  exports: [ExchangeCoreServiceEth],
})
export class ExchangeCoreModule {}
