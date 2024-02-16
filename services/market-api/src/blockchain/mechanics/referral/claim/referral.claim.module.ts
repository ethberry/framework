import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralClaimService } from "./referral.claim.service";
import { ReferralClaimController } from "./referral.claim.controller";
import { ReferralRewardModule } from "../reward/reward.module";
import { ReferralClaimEntity } from "./referral.claim.entity";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { ClaimModule } from "../../claim/claim.module";

@Module({
  imports: [AssetModule, ClaimModule, ReferralRewardModule, TypeOrmModule.forFeature([ReferralClaimEntity])],
  providers: [ReferralClaimService],
  controllers: [ReferralClaimController],
  exports: [ReferralClaimService],
})
export class ReferralClaimModule {}
