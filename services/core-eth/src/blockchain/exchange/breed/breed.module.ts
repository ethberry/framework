import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ExchangeBreedServiceEth } from "./breed.service.eth";
import { ExchangeBreedControllerEth } from "./breed.controller.eth";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, EventHistoryModule, AssetModule, NotificatorModule],
  providers: [signalServiceProvider, Logger, ExchangeBreedServiceEth],
  controllers: [ExchangeBreedControllerEth],
  exports: [ExchangeBreedServiceEth],
})
export class ExchangeBreedModule {}
