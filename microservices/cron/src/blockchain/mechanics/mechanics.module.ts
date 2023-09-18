import { Module } from "@nestjs/common";

import { LotteryModule } from "./lottery/lottery.module";
import { RaffleModule } from "./raffle/raffle.module";

@Module({
  imports: [LotteryModule, RaffleModule],
})
export class MechanicsModule {}
