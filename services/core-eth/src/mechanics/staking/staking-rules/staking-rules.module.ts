import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { StakingHistoryModule } from "../staking-history/staking-history.module";
import { StakingStakesModule } from "../staking-stakes/staking-stakes.module";
import { StakingRulesControllerEth } from "./staking-rules.controller.eth";
import { StakingLogModule } from "../staking-log/staking.log.module";
import { StakingRulesServiceEth } from "./staking-rules.service.eth";
import { StakingRulesEntity } from "./staking-rules.entity";
import { StakingRulesService } from "./staking-rules.service";

@Module({
  imports: [
    StakingStakesModule,
    StakingLogModule,
    StakingHistoryModule,
    ContractManagerModule,
    TypeOrmModule.forFeature([StakingRulesEntity]),
  ],
  providers: [Logger, StakingRulesServiceEth, StakingRulesService],
  controllers: [StakingRulesControllerEth],
  exports: [StakingRulesServiceEth, StakingRulesService],
})
export class StakingRulesModule {}
