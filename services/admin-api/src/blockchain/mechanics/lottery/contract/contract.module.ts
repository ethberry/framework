import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { LotteryContractService } from "./contract.service";
import { LotteryContractController } from "./contract.controller";
import { scheduleLotteryServiceProvider } from "../../../../common/providers";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [scheduleLotteryServiceProvider, LotteryContractService],
  controllers: [LotteryContractController],
  exports: [LotteryContractService],
})
export class LotteryContractModule {}
