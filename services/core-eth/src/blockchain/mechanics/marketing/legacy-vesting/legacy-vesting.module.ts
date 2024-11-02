import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { LegacyVestingControllerEth } from "./legacy-vesting.controller.eth";
import { LegacyVestingServiceEth } from "./legacy-vesting.service.eth";
import { LegacyVestingServiceLog } from "./legacy-vesting.service.log";

@Module({
  imports: [
    ConfigModule,
    EthersModule.deferred(),
    EventHistoryModule,
    ContractModule,
    TokenModule,
    BalanceModule,
    NotificatorModule,
  ],
  providers: [signalServiceProvider, LegacyVestingServiceLog, LegacyVestingServiceEth],
  controllers: [LegacyVestingControllerEth],
  exports: [LegacyVestingServiceLog, LegacyVestingServiceEth],
})
export class LegacyVestingModule implements OnModuleInit {
  constructor(protected readonly vestingServiceLog: LegacyVestingServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.vestingServiceLog.initRegistry();
  }
}
