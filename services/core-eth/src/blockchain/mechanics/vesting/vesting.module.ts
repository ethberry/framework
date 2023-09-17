import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { BalanceModule } from "../../hierarchy/balance/balance.module";
import { VestingControllerEth } from "./vesting.controller.eth";
import { VestingServiceEth } from "./vesting.service.eth";

@Module({
  imports: [ConfigModule, EventHistoryModule, ContractModule, TokenModule, BalanceModule, NotificatorModule],
  providers: [VestingServiceEth],
  controllers: [VestingControllerEth],
  exports: [VestingServiceEth],
})
export class VestingModule {}
