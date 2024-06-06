import { Module } from "@nestjs/common";

import { RaffleTicketTokenModule } from "./token/token.module";
import { RaffleTicketContractModule } from "./contract/contract.module";

@Module({
  imports: [RaffleTicketContractModule, RaffleTicketTokenModule],
})
export class RaffleTicketModule {}
