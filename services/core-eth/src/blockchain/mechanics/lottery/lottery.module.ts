import { Module } from "@nestjs/common";

import { LotteryTicketModule } from "./ticket/ticket.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryHistoryModule } from "./history/history.module";

@Module({
  imports: [LotteryTicketModule, LotteryRoundModule, LotteryHistoryModule],
})
export class LotteryModule {}
