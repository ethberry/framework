import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { AssetModule } from "../asset/asset.module";
import { ExchangeLotteryServiceEth } from "./lottery.service.eth";
import { ExchangeLotteryControllerEth } from "./lottery.controller.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [EventHistoryModule, TemplateModule, NotificatorModule, AssetModule, ConfigModule],
  providers: [signalServiceProvider, ExchangeLotteryServiceEth],
  controllers: [ExchangeLotteryControllerEth],
  exports: [ExchangeLotteryServiceEth],
})
export class ExchangeLotteryModule {}
