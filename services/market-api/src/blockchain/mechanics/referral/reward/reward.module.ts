import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralRewardService } from "./reward.service";
import { ReferralRewardEntity } from "./reward.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralRewardEntity])],
  providers: [ReferralRewardService],
  exports: [ReferralRewardService],
})
export class ReferralRewardModule {}
