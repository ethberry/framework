import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { LegacyVestingService } from "./legacy-vesting.service";
import { LegacyVestingController } from "./legacy-vesting.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity])],
  providers: [LegacyVestingService],
  controllers: [LegacyVestingController],
  exports: [LegacyVestingService],
})
export class LegacyVestingModule {}
