import { Module } from "@nestjs/common";

import { RaffleContractModule } from "./contract/contract.module";
import { RaffleTicketModule } from "./ticket/ticket.module";
import { RaffleRoundModule } from "./round/round.module";
import { RaffleTokenModule } from "./token/token.module";

@Module({
  imports: [RaffleContractModule, RaffleTicketModule, RaffleRoundModule, RaffleTokenModule],
})
export class RaffleModule {}
