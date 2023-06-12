import { Module } from "@nestjs/common";

import { ExchangeLotteryServiceEth } from "./lottery.service.eth";
import { ExchangeLotteryControllerEth } from "./lottery.controller.eth";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [EventHistoryModule, AssetModule],
  providers: [ExchangeLotteryServiceEth],
  controllers: [ExchangeLotteryControllerEth],
  exports: [ExchangeLotteryServiceEth],
})
export class ExchangeLotteryModule {}
