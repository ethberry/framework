import { Module } from "@nestjs/common";

import { LotteryContractModule } from "./contract/lottery.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryTicketModule } from "./ticket/ticket.module";

@Module({
  imports: [LotteryContractModule, LotteryRoundModule, LotteryTicketModule],
})
export class LotteryModule {}
