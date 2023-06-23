import { Module } from "@nestjs/common";

import { LotteryContractModule } from "./contract/contract.module";
import { LotteryTicketModule } from "./ticket/ticket.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryTokenModule } from "./token/token.module";

@Module({
  imports: [LotteryContractModule, LotteryTicketModule, LotteryRoundModule, LotteryTokenModule],
})
export class LotteryModule {}
