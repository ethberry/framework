import { Logger, Module } from "@nestjs/common";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { CraftModule } from "../../mechanics/craft/craft.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeCraftControllerEth } from "./craft.controller.eth";
import { ExchangeCraftServiceEth } from "./craft.service.eth";

@Module({
  imports: [EventHistoryModule, AssetModule, NotificatorModule, CraftModule],
  providers: [Logger, ExchangeCraftServiceEth],
  controllers: [ExchangeCraftControllerEth],
  exports: [ExchangeCraftServiceEth],
})
export class ExchangeCraftModule {}
