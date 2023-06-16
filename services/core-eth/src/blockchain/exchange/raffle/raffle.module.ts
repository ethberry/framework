import { Module } from "@nestjs/common";

import { ExchangeRaffleServiceEth } from "./raffle.service.eth";
import { ExchangeRaffleControllerEth } from "./raffle.controller.eth";
import { TokenModule } from "../../hierarchy/token/token.module";
import { AssetModule } from "../asset/asset.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { RaffleRoundModule } from "../../mechanics/raffle/round/round.module";
import { RaffleTicketModule } from "../../mechanics/raffle/ticket/ticket.module";

@Module({
  imports: [EventHistoryModule, AssetModule, TokenModule, RaffleTicketModule, RaffleRoundModule],
  providers: [ExchangeRaffleServiceEth],
  controllers: [ExchangeRaffleControllerEth],
  exports: [ExchangeRaffleServiceEth],
})
export class ExchangeRaffleModule {}
