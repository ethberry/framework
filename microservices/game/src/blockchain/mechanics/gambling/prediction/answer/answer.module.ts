import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PredictionAnswerService } from "./answer.service";
import { PredictionAnswerEntity } from "./answer.entity";
import { PredictionAnswerController } from "./answer.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PredictionAnswerEntity])],
  providers: [PredictionAnswerService],
  controllers: [PredictionAnswerController],
  exports: [PredictionAnswerService],
})
export class PredictionAnswerModule {}
