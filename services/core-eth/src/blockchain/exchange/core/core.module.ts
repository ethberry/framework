import { Module } from "@nestjs/common";

import { ExchangeCoreServiceEth } from "./core.service.eth";
import { ExchangeCoreControllerEth } from "./core.controller.eth";
import { ExchangeHistoryModule } from "../history/history.module";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [ExchangeHistoryModule, AssetModule],
  providers: [ExchangeCoreServiceEth],
  controllers: [ExchangeCoreControllerEth],
  exports: [ExchangeCoreServiceEth],
})
export class ExchangeCoreModule {}
