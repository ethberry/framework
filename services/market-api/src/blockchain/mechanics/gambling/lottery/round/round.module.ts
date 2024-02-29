import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTokenModule } from "../token/token.module";
import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundController } from "./round.controller";
import { LotteryRoundAggregationEntity } from "./round.aggregation.entity";

@Module({
  imports: [LotteryTokenModule, TypeOrmModule.forFeature([LotteryRoundEntity, LotteryRoundAggregationEntity])],
  providers: [LotteryRoundService],
  controllers: [LotteryRoundController],
  exports: [LotteryRoundService],
})
export class LotteryRoundModule {}
