import { Logger, Module } from "@nestjs/common";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { MysteryModule } from "../../mechanics/mystery/mystery.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeMysteryControllerEth } from "./mystery.controller.eth";
import { ExchangeMysteryServiceEth } from "./mystery.service.eth";

@Module({
  imports: [EventHistoryModule, MysteryModule, NotificatorModule, AssetModule],
  providers: [Logger, ExchangeMysteryServiceEth],
  controllers: [ExchangeMysteryControllerEth],
  exports: [ExchangeMysteryServiceEth],
})
export class ExchangeMysteryModule {}
