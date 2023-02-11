import { Logger, Module } from "@nestjs/common";

import { ExchangeBreedServiceEth } from "./breed.service.eth";
import { ExchangeBreedControllerEth } from "./breed.controller.eth";
import { AssetModule } from "../asset/asset.module";
import { BreedModule } from "../../mechanics/breed/breed.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [EventHistoryModule, AssetModule, BreedModule],
  providers: [Logger, ExchangeBreedServiceEth],
  controllers: [ExchangeBreedControllerEth],
  exports: [ExchangeBreedServiceEth],
})
export class ExchangeBreedModule {}
