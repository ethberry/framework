import { Module } from "@nestjs/common";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeLotteryServiceEth } from "./lottery.service.eth";
import { ExchangeLotteryControllerEth } from "./lottery.controller.eth";

@Module({
  imports: [EventHistoryModule, TemplateModule, NotificatorModule, AssetModule],
  providers: [ExchangeLotteryServiceEth],
  controllers: [ExchangeLotteryControllerEth],
  exports: [ExchangeLotteryServiceEth],
})
export class ExchangeLotteryModule {}
