import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitListContractService } from "./contract.service";
import { WaitListContractController } from "./contract.controller";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [WaitListContractService],
  controllers: [WaitListContractController],
  exports: [WaitListContractService],
})
export class WaitListContractModule {}
