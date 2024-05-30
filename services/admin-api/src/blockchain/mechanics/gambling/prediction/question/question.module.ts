import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetModule } from "../../../../exchange/asset/asset.module";
import { PredictionQuestionService } from "./question.service";
import { PredictionQuestionController } from "./question.controller";
import { PredictionQuestionEntity } from "./question.entity";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([PredictionQuestionEntity])],
  providers: [PredictionQuestionService],
  controllers: [PredictionQuestionController],
  exports: [PredictionQuestionService],
})
export class PredictionQuestionModule {}
