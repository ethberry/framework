import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ReferralControllerEth } from "./referral.controller.eth";
import { ReferralServiceEth } from "./referral.service.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { signalServiceProvider } from "../../../common/providers";
import { TokenModule } from "../../hierarchy/token/token.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { ReferralProgramModule } from "./program/referral.program.module";
import { ReferralRewardModule } from "./reward/referral.reward.module";

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
  ],
  providers: [Logger, signalServiceProvider, ReferralServiceEth],
  controllers: [ReferralControllerEth],
  exports: [ReferralServiceEth],
})
export class ReferralModule {}
