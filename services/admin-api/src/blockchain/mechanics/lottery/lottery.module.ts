import { Module } from "@nestjs/common";

import { LotteryRoundModule } from "./round/round.module";
import { LotteryTicketModule } from "./ticket/ticket.module";

@Module({
  imports: [LotteryRoundModule, LotteryTicketModule],
})
export class LotteryModule {}
