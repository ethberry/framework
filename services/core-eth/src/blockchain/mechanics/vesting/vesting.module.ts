import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { VestingServiceEth } from "./vesting.service.eth";
import { VestingEntity } from "./vesting.entity";
import { VestingControllerEth } from "./vesting.controller.eth";
import { VestingHistoryModule } from "./history/vesting-history.module";
import { VestingService } from "./vesting.service";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [ConfigModule, VestingHistoryModule, TypeOrmModule.forFeature([VestingEntity]), ContractModule],
  providers: [Logger, VestingService, VestingServiceEth],
  controllers: [VestingControllerEth],
  exports: [VestingService, VestingServiceEth],
})
export class VestingModule {}
