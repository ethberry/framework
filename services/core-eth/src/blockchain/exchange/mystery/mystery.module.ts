import { Logger, Module } from "@nestjs/common";

import { ExchangeMysteryServiceEth } from "./mystery.service.eth";
import { ExchangeMysteryControllerEth } from "./mystery.controller.eth";
import { MysteryModule } from "../../mechanics/mystery/mystery.module";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [EventHistoryModule, MysteryModule, AssetModule],
  providers: [Logger, ExchangeMysteryServiceEth],
  controllers: [ExchangeMysteryControllerEth],
  exports: [ExchangeMysteryServiceEth],
})
export class ExchangeMysteryModule {}
