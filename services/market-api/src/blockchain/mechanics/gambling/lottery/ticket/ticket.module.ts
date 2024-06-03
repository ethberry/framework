import { Module } from "@nestjs/common";

import { LotteryTicketTokenModule } from "./token/token.module";

@Module({
  imports: [LotteryTicketTokenModule],
})
export class LotteryTicketModule {}
