import { Module } from "@nestjs/common";

import { LotteryTicketModule } from "./ticket/ticket.module";
import { LotteryRoundModule } from "./round/round.module";

@Module({
  imports: [LotteryTicketModule, LotteryRoundModule],
})
export class LotteryModule {}
