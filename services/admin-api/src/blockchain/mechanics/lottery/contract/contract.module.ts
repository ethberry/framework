import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { LotteryContractService } from "./contract.service";
import { LotteryContractController } from "./contract.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [LotteryContractService],
  controllers: [LotteryContractController],
  exports: [LotteryContractService],
})
export class LotteryContractModule {}
