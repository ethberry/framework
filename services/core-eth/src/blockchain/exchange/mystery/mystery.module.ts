import { Logger, Module } from "@nestjs/common";

import { ExchangeMysteryServiceEth } from "./mystery.service.eth";
import { ExchangeMysteryControllerEth } from "./mystery.controller.eth";
import { ExchangeHistoryModule } from "../history/history.module";
import { MysteryModule } from "../../mechanics/mystery/mystery.module";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [ExchangeHistoryModule, MysteryModule, AssetModule],
  providers: [Logger, ExchangeMysteryServiceEth],
  controllers: [ExchangeMysteryControllerEth],
  exports: [ExchangeMysteryServiceEth],
})
export class ExchangeMysteryModule {}
