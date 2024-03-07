import { Module } from "@nestjs/common";

import { RaffleModule } from "./raffle/raffle.module";
import { PredictionModule } from "./prediction/prediction.module";

@Module({
  imports: [RaffleModule, PredictionModule],
})
export class GamblingMechanicsModule {}
