import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralRewardService } from "./reward.service";
import { ReferralEntity } from "./reward.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralEntity])],
  providers: [ReferralRewardService],
  exports: [ReferralRewardService],
})
export class ReferralRewardModule {}
