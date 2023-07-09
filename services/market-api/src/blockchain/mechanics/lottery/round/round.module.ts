import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundController } from "./round.controller";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { LotteryTokenModule } from "../token/token.module";

@Module({
  imports: [ContractModule, LotteryTokenModule, TypeOrmModule.forFeature([LotteryRoundEntity])],
  providers: [LotteryRoundService],
  controllers: [LotteryRoundController],
  exports: [LotteryRoundService],
})
export class LotteryRoundModule {}
