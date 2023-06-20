import { Module } from "@nestjs/common";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { ExchangeCoreServiceEth } from "./core.service.eth";
import { ExchangeCoreControllerEth } from "./core.controller.eth";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [EventHistoryModule, NotificatorModule, AssetModule],
  providers: [ExchangeCoreServiceEth],
  controllers: [ExchangeCoreControllerEth],
  exports: [ExchangeCoreServiceEth],
})
export class ExchangeCoreModule {}
