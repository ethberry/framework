import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { LotteryContractService } from "./lottery.service";
import { LotteryContractController } from "./lottery.controller";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [LotteryContractService],
  controllers: [LotteryContractController],
  exports: [LotteryContractService],
})
export class LotteryContractModule {}
