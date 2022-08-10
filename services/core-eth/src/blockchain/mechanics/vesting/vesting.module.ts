import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VestingServiceEth } from "./vesting.service.eth";
import { VestingEntity } from "./vesting.entity";
import { VestingControllerEth } from "./vesting.controller.eth";
import { VestingHistoryModule } from "./vesting-history/vesting-history.module";
import { VestingService } from "./vesting.service";
import { ContractManagerModule } from "../../contract-manager/contract-manager.module";

@Module({
  imports: [ContractManagerModule, VestingHistoryModule, TypeOrmModule.forFeature([VestingEntity])],
  providers: [Logger, VestingService, VestingServiceEth],
  controllers: [VestingControllerEth],
  exports: [VestingService, VestingServiceEth],
})
export class VestingModule {}
