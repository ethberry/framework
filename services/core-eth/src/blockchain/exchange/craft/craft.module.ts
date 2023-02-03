import { Logger, Module } from "@nestjs/common";

import { ExchangeCraftServiceEth } from "./craft.service.eth";
import { ExchangeCraftControllerEth } from "./craft.controller.eth";
import { ExchangeHistoryModule } from "../history/history.module";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [ExchangeHistoryModule, AssetModule],
  providers: [Logger, ExchangeCraftServiceEth],
  controllers: [ExchangeCraftControllerEth],
  exports: [ExchangeCraftServiceEth],
})
export class ExchangeCraftModule {}
