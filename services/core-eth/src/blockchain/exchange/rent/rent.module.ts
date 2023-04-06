import { Logger, Module } from "@nestjs/common";

import { ExchangeRentServiceEth } from "./rent.service.eth";
import { ExchangeRentControllerEth } from "./rent.controller.eth";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";

@Module({
  imports: [EventHistoryModule, NotificatorModule],
  providers: [Logger, ExchangeRentServiceEth],
  controllers: [ExchangeRentControllerEth],
  exports: [ExchangeRentServiceEth],
})
export class ExchangeRentModule {}
