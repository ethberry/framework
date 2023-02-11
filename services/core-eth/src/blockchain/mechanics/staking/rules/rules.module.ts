import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingDepositModule } from "../deposit/deposit.module";
import { StakingRulesControllerEth } from "./rules.controller.eth";
import { StakingLogModule } from "../log/log.module";
import { StakingRulesServiceEth } from "./rules.service.eth";
import { StakingRulesEntity } from "./rules.entity";
import { StakingRulesService } from "./rules.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";

@Module({
  imports: [
    ContractModule,
    StakingDepositModule,
    StakingLogModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([StakingRulesEntity]),
  ],
  providers: [Logger, StakingRulesServiceEth, StakingRulesService],
  controllers: [StakingRulesControllerEth],
  exports: [StakingRulesServiceEth, StakingRulesService],
})
export class StakingRulesModule {}
