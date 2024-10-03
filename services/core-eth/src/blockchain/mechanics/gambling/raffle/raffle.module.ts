import { Module } from "@nestjs/common";

import { RaffleTicketModule } from "./ticket/ticket.module";
import { RaffleRoundModule } from "./round/round.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";

@Module({
  imports: [RaffleTicketModule, RaffleRoundModule, EventHistoryModule],
})
export class RaffleModule {}
