import { Module } from "@nestjs/common";

import { LotteryContractModule } from "./contract/contract.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryTicketModule } from "./ticket/ticket.module";

@Module({
  imports: [LotteryContractModule, LotteryRoundModule, LotteryTicketModule],
})
export class LotteryModule {}
