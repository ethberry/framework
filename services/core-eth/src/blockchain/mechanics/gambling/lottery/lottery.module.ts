import { Module } from "@nestjs/common";

import { EventHistoryModule } from "../../../event-history/event-history.module";
import { LotteryTicketModule } from "./ticket/ticket.module";
import { LotteryRoundModule } from "./round/round.module";

@Module({
  imports: [LotteryTicketModule, LotteryRoundModule, EventHistoryModule],
})
export class LotteryModule {}
