import { Module } from "@nestjs/common";

import { LotteryRoundModule } from "./round/round.module";

@Module({
  imports: [LotteryRoundModule],
})
export class LotteryModule {}
