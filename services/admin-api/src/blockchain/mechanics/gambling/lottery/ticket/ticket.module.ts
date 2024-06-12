import { Module } from "@nestjs/common";

import { LotteryTicketTokenModule } from "./token/token.module";
import { LotteryTicketContractModule } from "./contract/contract.module";

@Module({
  imports: [LotteryTicketContractModule, LotteryTicketTokenModule],
})
export class LotteryTicketModule {}
