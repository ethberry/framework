import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitListContractService } from "./contract.service";
import { WaitListContractController } from "./contract.controller";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [WaitListContractService],
  controllers: [WaitListContractController],
  exports: [WaitListContractService],
})
export class WaitListContractModule {}
