import { Module } from "@nestjs/common";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeCoreControllerEth } from "./core.controller.eth";
import { ExchangeCoreServiceEth } from "./core.service.eth";

@Module({
  imports: [EventHistoryModule, NotificatorModule, AssetModule],
  providers: [ExchangeCoreServiceEth],
  controllers: [ExchangeCoreControllerEth],
  exports: [ExchangeCoreServiceEth],
})
export class ExchangeCoreModule {}
