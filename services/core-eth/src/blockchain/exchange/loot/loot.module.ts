import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { LootModule } from "../../mechanics/marketing/loot/loot.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeLootControllerEth } from "./loot.controller.eth";
import { ExchangeLootServiceEth } from "./loot.service.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [EventHistoryModule, LootModule, NotificatorModule, AssetModule, ConfigModule],
  providers: [signalServiceProvider, Logger, ExchangeLootServiceEth],
  controllers: [ExchangeLootControllerEth],
  exports: [ExchangeLootServiceEth],
})
export class ExchangeLootModule {}
