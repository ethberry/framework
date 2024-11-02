import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { LegacyVestingService } from "./contract.service";
import { LegacyVestingController } from "./contract.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [LegacyVestingService],
  controllers: [LegacyVestingController],
  exports: [LegacyVestingService],
})
export class LegacyVestingContractModule {}
