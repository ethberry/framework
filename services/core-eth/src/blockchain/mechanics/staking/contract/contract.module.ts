import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EventHistoryModule } from "../../../event-history/event-history.module";
import { StakingRulesControllerEth } from "./contract.controller.eth";
import { StakingContractServiceEth } from "./contract.service.eth";
import { signalServiceProvider } from "../../../../common/providers";

@Module({
  imports: [EventHistoryModule, ConfigModule],
  providers: [Logger, signalServiceProvider, StakingContractServiceEth],
  controllers: [StakingRulesControllerEth],
  exports: [StakingContractServiceEth],
})
export class StakingContractModule {}
