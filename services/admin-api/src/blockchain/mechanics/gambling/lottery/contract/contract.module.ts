import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { cronServiceProvider } from "../../../../../common/providers";
import { LotteryContractService } from "./contract.service";
import { LotteryContractController } from "./contract.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [cronServiceProvider, LotteryContractService],
  controllers: [LotteryContractController],
  exports: [LotteryContractService],
})
export class LotteryContractModule {}
