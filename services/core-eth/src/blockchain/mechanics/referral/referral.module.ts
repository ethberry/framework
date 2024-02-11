import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralControllerEth } from "./referral.controller.eth";
import { ReferralServiceEth } from "./referral.service.eth";
import { ReferralService } from "./referral.service";
import { ReferralRewardEntity } from "./referral.reward.entity";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { signalServiceProvider } from "../../../common/providers";
import { TokenModule } from "../../hierarchy/token/token.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { ReferralProgramEntity } from "./program/referral.program.entity";
import { ReferralTreeEntity } from "./tree/referral.tree.entity";
import { ReferralProgramService } from "./program/referral.program.service";
import { ReferralTreeService } from "./tree/referral.tree.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReferralRewardEntity]),
    TypeOrmModule.forFeature([ReferralProgramEntity]),
    TypeOrmModule.forFeature([ReferralTreeEntity]),
    EventHistoryModule,
    ContractModule,
    TokenModule,
    AssetModule,
    NotificatorModule,
    ConfigModule,
  ],
  providers: [
    Logger,
    signalServiceProvider,
    ReferralService,
    ReferralProgramService,
    ReferralTreeService,
    ReferralServiceEth,
  ],
  controllers: [ReferralControllerEth],
  exports: [ReferralService, ReferralProgramService, ReferralTreeService, ReferralServiceEth],
})
export class ReferralModule {}
