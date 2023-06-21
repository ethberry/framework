import { Logger, Module } from "@nestjs/common";

import { ExchangeBreedServiceEth } from "./breed.service.eth";
import { ExchangeBreedControllerEth } from "./breed.controller.eth";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";

@Module({
  imports: [EventHistoryModule, AssetModule, NotificatorModule],
  providers: [Logger, ExchangeBreedServiceEth],
  controllers: [ExchangeBreedControllerEth],
  exports: [ExchangeBreedServiceEth],
})
export class ExchangeBreedModule {}
