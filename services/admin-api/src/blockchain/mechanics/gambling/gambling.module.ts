import { Module } from "@nestjs/common";

import { LotteryModule } from "./lottery/lottery.module";
import { PonziModule } from "./ponzi/ponzi.module";
import { RaffleModule } from "./raffle/raffle.module";
import { PredictionModule } from "./prediction/prediction.module";

@Module({
  imports: [LotteryModule, RaffleModule, PonziModule, PredictionModule],
})
export class GamblingMechanicsModule {}
