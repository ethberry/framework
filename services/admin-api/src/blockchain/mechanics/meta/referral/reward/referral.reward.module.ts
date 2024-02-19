import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralRewardService } from "./referral.reward.service";
import { ReferralRewardEntity } from "./referral.reward.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralRewardEntity])],
  providers: [ReferralRewardService],
  exports: [ReferralRewardService],
})
export class ReferralRewardModule {}
