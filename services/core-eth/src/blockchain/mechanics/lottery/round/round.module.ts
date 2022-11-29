import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CronExpression } from "@nestjs/schedule";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundService } from "./round.service";
import { LotteryRoundServiceCron } from "./round.service.cron";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { LotteryRoundControllerEth } from "./round.controller.eth";
import { LotteryRoundServiceEth } from "./round.service.eth";
import { LotteryHistoryModule } from "../history/history.module";
import { RoundControllerRmq } from "./round.controller.rmq";
import { RoundServiceRmq } from "./round.service.rmq";

@Module({
  imports: [ConfigModule, ContractModule, LotteryHistoryModule, TypeOrmModule.forFeature([LotteryRoundEntity])],
  controllers: [RoundControllerRmq, LotteryRoundControllerEth],
  providers: [
    Logger,
    ethersRpcProvider,
    ethersSignerProvider,
    LotteryRoundService,
    LotteryRoundServiceEth,
    LotteryRoundServiceCron,
    RoundServiceRmq,
  ],
  exports: [LotteryRoundService, LotteryRoundServiceEth, LotteryRoundServiceCron, RoundServiceRmq],
})
export class LotteryRoundModule implements OnModuleInit {
  constructor(private readonly lotteryRoundServiceCron: LotteryRoundServiceCron) {}

  // start pre-defined lottery round end-start Cron Job
  public onModuleInit(): void {
    return this.lotteryRoundServiceCron.setRoundCronJob(CronExpression.EVERY_DAY_AT_MIDNIGHT);
  }
}
