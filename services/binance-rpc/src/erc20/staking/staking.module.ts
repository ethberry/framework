import { Logger, Module } from "@nestjs/common";

import { Erc20StakingControllerWs } from "./staking.controller.ws";
import { Erc20StakingServiceWs } from "./staking.service.ws";
import { Erc20StakingHistoryModule } from "../staking-history/staking-history.module";

@Module({
  imports: [Erc20StakingHistoryModule],
  providers: [Logger, Erc20StakingServiceWs],
  controllers: [Erc20StakingControllerWs],
  exports: [Erc20StakingServiceWs],
})
export class Erc20StakingModule {}
