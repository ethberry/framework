import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { ExchangeRentControllerEth } from "./rent.controller.eth";
import { ExchangeRentServiceEth } from "./rent.service.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, EventHistoryModule, NotificatorModule],
  providers: [signalServiceProvider, Logger, ExchangeRentServiceEth],
  controllers: [ExchangeRentControllerEth],
  exports: [ExchangeRentServiceEth],
})
export class ExchangeRentModule {}
