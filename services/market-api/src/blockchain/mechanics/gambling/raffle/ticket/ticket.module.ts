import { Module } from "@nestjs/common";

import { RaffleTicketTokenModule } from "./token/token.module";

@Module({
  imports: [RaffleTicketTokenModule],
})
export class RaffleTicketModule {}
