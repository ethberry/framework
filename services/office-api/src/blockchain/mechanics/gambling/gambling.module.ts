import { Module } from "@nestjs/common";

import { PonziModule } from "./ponzi/ponzi.module";
import { PredictionModule } from "./prediction/prediction.module";

@Module({
  imports: [PonziModule, PredictionModule],
})
export class GamblingMechanicsModule {}
