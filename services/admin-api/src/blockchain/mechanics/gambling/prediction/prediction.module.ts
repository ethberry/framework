import { Module } from "@nestjs/common";

import { PredictionAnswerModule } from "./answer/answer.module";
import { PredictionContractModule } from "./contract/contract.module";
import { PredictionQuestionModule } from "./question/question.module";

@Module({
  imports: [PredictionQuestionModule, PredictionContractModule, PredictionAnswerModule],
})
export class PredictionModule {}
