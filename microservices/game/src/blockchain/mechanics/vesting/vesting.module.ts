import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { VestingService } from "./vesting.service";
import { VestingController } from "./vesting.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [VestingService],
  controllers: [VestingController],
  exports: [VestingService],
})
export class VestingModule {}
