import { Module } from "@nestjs/common";

import { RaffleSignModule } from "./sign/sign.module";
import { RaffleRoundModule } from "./round/round.module";
import { RaffleContractModule } from "./contract/raffle.module";
import { RaffleTicketModule } from "./ticket/ticket.module";

@Module({
  imports: [RaffleContractModule, RaffleRoundModule, RaffleTicketModule, RaffleSignModule],
})
export class RaffleModule {}
