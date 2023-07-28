import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { VestingServiceEth } from "./vesting.service.eth";
import { VestingControllerEth } from "./vesting.controller.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { BalanceModule } from "../../hierarchy/balance/balance.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";

@Module({
  imports: [ConfigModule, EventHistoryModule, ContractModule, TokenModule, BalanceModule, NotificatorModule],
  providers: [Logger, VestingServiceEth],
  controllers: [VestingControllerEth],
  exports: [VestingServiceEth],
})
export class VestingModule {}
