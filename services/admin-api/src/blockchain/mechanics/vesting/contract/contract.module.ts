import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { VestingService } from "./contract.service";
import { VestingController } from "./contract.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [VestingService],
  controllers: [VestingController],
  exports: [VestingService],
})
export class VestingContractModule {}
