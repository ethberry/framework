import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { VestingServiceEth } from "./vesting.service.eth";
import { VestingControllerEth } from "./vesting.controller.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { ContractHistoryModule } from "../../hierarchy/contract/history/history.module";

@Module({
  imports: [ConfigModule, ContractHistoryModule, ContractModule],
  providers: [Logger, VestingServiceEth],
  controllers: [VestingControllerEth],
  exports: [VestingServiceEth],
})
export class VestingModule {}
