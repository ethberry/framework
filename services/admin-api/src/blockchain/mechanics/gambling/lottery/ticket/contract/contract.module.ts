import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTicketContractService } from "./contract.service";
import { LotteryTicketContractController } from "./contract.controller";
import { ContractEntity } from "../../../../../hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [LotteryTicketContractService],
  controllers: [LotteryTicketContractController],
  exports: [LotteryTicketContractService],
})
export class LotteryTicketContractModule {}
