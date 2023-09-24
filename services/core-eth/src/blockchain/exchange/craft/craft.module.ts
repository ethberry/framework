import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { CraftModule } from "../../mechanics/recipes/craft/craft.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeCraftControllerEth } from "./craft.controller.eth";
import { ExchangeCraftServiceEth } from "./craft.service.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, EventHistoryModule, AssetModule, NotificatorModule, CraftModule],
  providers: [signalServiceProvider, Logger, ExchangeCraftServiceEth],
  controllers: [ExchangeCraftControllerEth],
  exports: [ExchangeCraftServiceEth],
})
export class ExchangeCraftModule {}
