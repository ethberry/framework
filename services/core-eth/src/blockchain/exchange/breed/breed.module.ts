import { Logger, Module } from "@nestjs/common";

import { ExchangeBreedServiceEth } from "./breed.service.eth";
import { ExchangeBreedControllerEth } from "./breed.controller.eth";
import { ExchangeHistoryModule } from "../history/history.module";
import { AssetModule } from "../asset/asset.module";
import { BreedModule } from "../../mechanics/breed/breed.module";

@Module({
  imports: [ExchangeHistoryModule, AssetModule, BreedModule],
  providers: [Logger, ExchangeBreedServiceEth],
  controllers: [ExchangeBreedControllerEth],
  exports: [ExchangeBreedServiceEth],
})
export class ExchangeBreedModule {}
