import { Module } from "@nestjs/common";

import { LotteryTicketModule } from "./ticket/ticket.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryHistoryModule } from "./history/history.module";
import { LotteryLogModule } from "./log/log.module";

@Module({
  imports: [LotteryLogModule, LotteryTicketModule, LotteryRoundModule, LotteryHistoryModule],
})
export class LotteryModule {}
