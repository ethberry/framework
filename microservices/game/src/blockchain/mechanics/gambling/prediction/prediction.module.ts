import { Module } from "@nestjs/common";

import { PredictionAnswerModule } from "./answer/answer.module";
import { PredictionQuestionModule } from "./question/question.module";
import { PredictionContractModule } from "./contract/contract.module";

@Module({
  imports: [PredictionContractModule, PredictionQuestionModule, PredictionAnswerModule],
})
export class PredictionModule {}
