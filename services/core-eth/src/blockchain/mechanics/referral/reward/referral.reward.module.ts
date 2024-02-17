import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryModule } from "../../../event-history/event-history.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { ReferralRewardEntity } from "./referral.reward.entity";
import { ReferralRewardService } from "./referral.reward.service";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { ReferralRewardShareService } from "./share/referral.reward.share.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ReferralProgramModule } from "../program/referral.program.module";
import { ReferralRewardShareEntity } from "./share/referral.reward.share.entity";

@Module({
  imports: [
    ReferralProgramModule,
    TypeOrmModule.forFeature([ReferralRewardEntity]),
    TypeOrmModule.forFeature([ReferralRewardShareEntity]),
    ContractModule,
    TokenModule,
    AssetModule,
    ConfigModule,
  ],
  providers: [ReferralRewardService, ReferralRewardShareService],
  exports: [ReferralRewardService, ReferralRewardShareService],
})
export class ReferralRewardModule {}
