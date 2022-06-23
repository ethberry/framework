import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerModule } from "../contract-manager/contract-manager.module";
import { StakingHistoryModule } from "./staking-history/staking-history.module";
import { StakesModule } from "./stakes/stakes.module";
import { StakingControllerEth } from "./staking.controller.eth";
import { StakingLogModule } from "./staking-log/staking.log.module";
import { StakingServiceEth } from "./staking.service.eth";
import { StakingRuleEntity } from "./staking.entity";
import { StakingService } from "./staking.service";

@Module({
  imports: [
    StakesModule,
    StakingLogModule,
    StakingHistoryModule,
    ContractManagerModule,
    TypeOrmModule.forFeature([StakingRuleEntity]),
  ],
  providers: [Logger, StakingServiceEth, StakingService],
  controllers: [StakingControllerEth],
  exports: [StakingServiceEth, StakingService],
})
export class StakingModule {}
