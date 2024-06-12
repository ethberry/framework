import { Module } from "@nestjs/common";

import { LotterySignModule } from "./sign/sign.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryContractModule } from "./contract/lottery.module";
import { LotteryTicketModule } from "./ticket/ticket.module";

@Module({
  imports: [LotteryContractModule, LotteryRoundModule, LotterySignModule, LotteryTicketModule],
})
export class LotteryModule {}
