import { Module } from "@nestjs/common";

import { RaffleContractModule } from "./contract/raffle.module";
import { RaffleRoundModule } from "./round/round.module";
import { RaffleTicketModule } from "./ticket/ticket.module";

@Module({
  imports: [RaffleContractModule, RaffleRoundModule, RaffleTicketModule],
})
export class RaffleModule {}
