import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerModule } from "../contract-manager/contract-manager.module";
import { StakingHistoryModule } from "./staking-history/staking-history.module";
import { StakingControllerEth } from "./staking.controller.eth";
import { StakingLogModule } from "./staking-log/staking.log.module";
import { StakingServiceEth } from "./staking.service.eth";
import { StakingEntity } from "./staking.entity";
import { StakingService } from "./staking.service";

@Module({
  imports: [StakingLogModule, StakingHistoryModule, ContractManagerModule, TypeOrmModule.forFeature([StakingEntity])],
  providers: [Logger, StakingServiceEth, StakingService],
  controllers: [StakingControllerEth],
  exports: [StakingServiceEth, StakingService],
})
export class StakingModule {}
