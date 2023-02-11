import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { VestingServiceEth } from "./vesting.service.eth";
import { VestingControllerEth } from "./vesting.controller.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [ConfigModule, EventHistoryModule, ContractModule],
  providers: [Logger, VestingServiceEth],
  controllers: [VestingControllerEth],
  exports: [VestingServiceEth],
})
export class VestingModule {}
