import { Module } from "@nestjs/common";

import { LotteryModule } from "./lottery/lottery.module";
import { PonziModule } from "./ponzi/ponzi.module";
import { RaffleModule } from "./raffle/raffle.module";

@Module({
  imports: [LotteryModule, RaffleModule, PonziModule],
})
export class GamblingMechanicsModule {}
