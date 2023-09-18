import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundController } from "./round.controller";
import { LotteryRoundAggregationEntity } from "./round.aggregation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LotteryRoundEntity, LotteryRoundAggregationEntity])],
  providers: [LotteryRoundService],
  controllers: [LotteryRoundController],
  exports: [LotteryRoundService],
})
export class LotteryRoundModule {}
