import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VestingContractService } from "./contract.service";
import { VestingContractController } from "./contract.controller";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [VestingContractService],
  controllers: [VestingContractController],
  exports: [VestingContractService],
})
export class VestingContractModule {}
