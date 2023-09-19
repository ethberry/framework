import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { scheduleLotteryServiceProvider } from "../../../../common/providers";
import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundController } from "./round.controller";
import { LotteryRoundAggregationEntity } from "./round.aggregation.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([LotteryRoundEntity, LotteryRoundAggregationEntity])],
  providers: [scheduleLotteryServiceProvider, LotteryRoundService],
  controllers: [LotteryRoundController],
  exports: [LotteryRoundService],
})
export class LotteryRoundModule {}
