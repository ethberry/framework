import { Logger, Module } from "@nestjs/common";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { ExchangeRentControllerEth } from "./rent.controller.eth";
import { ExchangeRentServiceEth } from "./rent.service.eth";

@Module({
  imports: [EventHistoryModule, NotificatorModule],
  providers: [Logger, ExchangeRentServiceEth],
  controllers: [ExchangeRentControllerEth],
  exports: [ExchangeRentServiceEth],
})
export class ExchangeRentModule {}
