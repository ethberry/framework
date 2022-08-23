import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundService } from "./round.service";
import { LotteryRoundServiceCron } from "./round.service.cron";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [ConfigModule, ContractModule, TypeOrmModule.forFeature([LotteryRoundEntity])],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, LotteryRoundService, LotteryRoundServiceCron],
  exports: [LotteryRoundService],
})
export class LotteryRoundModule {}
