import { Logger, Module } from "@nestjs/common";

import { ExchangeCraftServiceEth } from "./craft.service.eth";
import { ExchangeCraftControllerEth } from "./craft.controller.eth";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [EventHistoryModule, AssetModule],
  providers: [Logger, ExchangeCraftServiceEth],
  controllers: [ExchangeCraftControllerEth],
  exports: [ExchangeCraftServiceEth],
})
export class ExchangeCraftModule {}
