import { Logger, Module } from "@nestjs/common";

import { EventHistoryModule } from "../../../event-history/event-history.module";
import { StakingRulesControllerEth } from "./contract.controller.eth";
import { StakingContractServiceEth } from "./contract.service.eth";

@Module({
  imports: [EventHistoryModule],
  providers: [Logger, StakingContractServiceEth],
  controllers: [StakingRulesControllerEth],
  exports: [StakingContractServiceEth],
})
export class StakingContractModule {}
