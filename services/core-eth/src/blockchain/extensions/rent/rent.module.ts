import { Module } from "@nestjs/common";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { RentServiceEth } from "./rent.service.eth";
import { RentControllerEth } from "./rent.controller.eth";

@Module({
  imports: [EventHistoryModule, NotificatorModule, TokenModule],
  providers: [RentServiceEth],
  controllers: [RentControllerEth],
  exports: [RentServiceEth],
})
export class RentModule {}
