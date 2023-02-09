import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VestingService } from "./vesting.service";
import { VestingController } from "./vesting.controller";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [VestingService],
  controllers: [VestingController],
  exports: [VestingService],
})
export class VestingModule {}
