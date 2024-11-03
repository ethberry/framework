import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { VestingControllerEth } from "./vesting.controller.eth";
import { VestingServiceEth } from "./vesting.service.eth";
import { VestingBoxServiceLog } from "./vesting.service.log";

@Module({
  imports: [
    ConfigModule,
    EventHistoryModule,
    ContractModule,
    TokenModule,
    BalanceModule,
    NotificatorModule,
    EthersModule.deferred(),
  ],
  providers: [VestingBoxServiceLog, VestingServiceEth, signalServiceProvider],
  controllers: [VestingControllerEth],
  exports: [VestingBoxServiceLog, VestingServiceEth],
})
export class VestingModule implements OnModuleInit {
  constructor(private readonly vestingBoxServiceLog: VestingBoxServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.vestingBoxServiceLog.initRegistry();
  }
}
