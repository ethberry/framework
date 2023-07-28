import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
// import { CronExpression } from "@nestjs/schedule";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundService } from "./round.service";
import { LotteryRoundServiceCron } from "./round.service.cron";
import { LotteryRoundControllerEth } from "./round.controller.eth";
import { LotteryRoundServiceEth } from "./round.service.eth";
import { RoundControllerRmq } from "./round.controller.rmq";
import { RoundServiceRmq } from "./round.service.rmq";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";

@Module({
  imports: [
    NotificatorModule,
    ConfigModule,
    AssetModule,
    TemplateModule,
    TokenModule,
    ContractModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([LotteryRoundEntity]),
  ],
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
    // return this.lotteryRoundServiceCron.setRoundCronJob(CronExpression.EVERY_DAY_AT_MIDNIGHT);
  }
}
