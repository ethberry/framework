import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerModule } from "../../../contract-manager/contract-manager.module";
import { StakingHistoryModule } from "../history/history.module";
import { StakingStakesModule } from "../stakes/stakes.module";
import { StakingRulesControllerEth } from "./rules.controller.eth";
import { StakingLogModule } from "../log/log.module";
import { StakingRulesServiceEth } from "./rules.service.eth";
import { StakingRulesEntity } from "./rules.entity";
import { StakingRulesService } from "./rules.service";

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
