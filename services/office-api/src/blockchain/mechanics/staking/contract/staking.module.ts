import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingService } from "./staking.service";
import { StakingController } from "./staking.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity])],
  providers: [StakingService],
  controllers: [StakingController],
  exports: [StakingService],
})
export class StakingContractModule {}
