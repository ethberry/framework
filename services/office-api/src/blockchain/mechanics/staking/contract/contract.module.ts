import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingContractService } from "./contract.service";
import { StakingController } from "./contract.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [StakingContractService],
  controllers: [StakingController],
  exports: [StakingContractService],
})
export class StakingContractModule {}
