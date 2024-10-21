import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { ReferralControllerEth } from "./referral.controller.eth";
import { ReferralServiceEth } from "./referral.service.eth";
import { ReferralProgramModule } from "./program/referral.program.module";
import { ReferralRewardModule } from "./reward/referral.reward.module";
import { ReferralServiceLog } from "./referral.service.log";

@Module({
  imports: [
    AssetModule,
    ConfigModule,
    ContractModule,
    EventHistoryModule,
    NotificatorModule,
    TokenModule,
    ReferralProgramModule,
    ReferralRewardModule,
    EthersModule.deferred(),
  ],
  providers: [Logger, signalServiceProvider, ReferralServiceLog, ReferralServiceEth],
  controllers: [ReferralControllerEth],
  exports: [ReferralServiceLog, ReferralServiceEth],
})
export class ReferralModule implements OnModuleInit {
  constructor(private readonly referralServiceLog: ReferralServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.referralServiceLog.initRegistry();
  }
}
