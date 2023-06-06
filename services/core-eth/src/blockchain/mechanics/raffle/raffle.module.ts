import { Module } from "@nestjs/common";

import { RaffleTicketModule } from "./ticket/ticket.module";
import { RaffleRoundModule } from "./round/round.module";
import { RaffleLogModule } from "./log/log.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [RaffleLogModule, RaffleTicketModule, RaffleRoundModule, EventHistoryModule],
})
export class RaffleModule {}
