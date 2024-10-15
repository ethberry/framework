import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { ReferralControllerEth } from "./referral.controller.eth";
import { ReferralServiceEth } from "./referral.service.eth";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { signalServiceProvider } from "../../../../common/providers";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
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
export class ReferralModule {}
