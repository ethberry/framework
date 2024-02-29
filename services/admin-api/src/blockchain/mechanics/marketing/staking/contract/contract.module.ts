import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingContractService } from "./contract.service";
import { StakingController } from "./contract.controller";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { StakingDepositModule } from "../deposit/deposit.module";

@Module({
  imports: [ConfigModule, StakingDepositModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [StakingContractService],
  controllers: [StakingController],
  exports: [StakingContractService],
})
export class StakingContractModule {}
