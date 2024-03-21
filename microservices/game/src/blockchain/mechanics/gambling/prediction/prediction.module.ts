import { Module } from "@nestjs/common";

import { PredictionAnswerModule } from "./answer/answer.module";
import { PredictionQuestionModule } from "./question/question.module";

@Module({
  imports: [PredictionQuestionModule, PredictionAnswerModule],
})
export class PredictionModule {}
