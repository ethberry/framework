import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundService } from "./round.service";

@Module({
  imports: [TypeOrmModule.forFeature([LotteryRoundEntity])],
  providers: [LotteryRoundService],
  exports: [LotteryRoundService],
})
export class LotteryRoundModule {}
