import { Logger, Module } from "@nestjs/common";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { DismantleModule } from "../../mechanics/recipes/dismantle/dismantle.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeDismantleControllerEth } from "./dismantle.controller.eth";
import { ExchangeDismantleServiceEth } from "./dismantle.service.eth";

@Module({
  imports: [EventHistoryModule, AssetModule, NotificatorModule, DismantleModule],
  providers: [Logger, ExchangeDismantleServiceEth],
  controllers: [ExchangeDismantleControllerEth],
  exports: [ExchangeDismantleServiceEth],
})
export class ExchangeDismantleModule {}
