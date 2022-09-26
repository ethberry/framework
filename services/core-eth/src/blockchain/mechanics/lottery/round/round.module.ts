import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundService } from "./round.service";
import { LotteryRoundServiceCron } from "./round.service.cron";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { LotteryRoundControllerEth } from "./round.controller.eth";
import { LotteryRoundServiceEth } from "./round.service.eth";
import { LotteryHistoryModule } from "../history/history.module";

@Module({
  imports: [ConfigModule, ContractModule, LotteryHistoryModule, TypeOrmModule.forFeature([LotteryRoundEntity])],
  controllers: [LotteryRoundControllerEth],
  providers: [
    Logger,
    ethersRpcProvider,
    ethersSignerProvider,
    LotteryRoundService,
    LotteryRoundServiceEth,
    LotteryRoundServiceCron,
  ],
  exports: [LotteryRoundService, LotteryRoundServiceEth],
})
export class LotteryRoundModule {}
