import { Module } from "@nestjs/common";

import { LotteryTicketModule } from "./ticket/ticket.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryLogModule } from "./log/log.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [LotteryLogModule, LotteryTicketModule, LotteryRoundModule, EventHistoryModule],
})
export class LotteryModule {}
