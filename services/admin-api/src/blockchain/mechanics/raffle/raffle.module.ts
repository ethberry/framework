import { Module } from "@nestjs/common";

import { RaffleRoundModule } from "./round/round.module";
import { RaffleTicketModule } from "./ticket/ticket.module";

@Module({
  imports: [RaffleRoundModule, RaffleTicketModule],
})
export class RaffleModule {}
