import { Module } from "@nestjs/common";

import { ExchangeCoreServiceEth } from "./core.service.eth";
import { ExchangeCoreControllerEth } from "./core.controller.eth";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [EventHistoryModule, AssetModule],
  providers: [ExchangeCoreServiceEth],
  controllers: [ExchangeCoreControllerEth],
  exports: [ExchangeCoreServiceEth],
})
export class ExchangeCoreModule {}
