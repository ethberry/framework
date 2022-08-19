import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ReferralRewardService } from "./reward.service";
import { ReferralRewardEntity } from "./reward.entity";
import { ReferralRewardController } from "./reward.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ReferralRewardEntity])],
  providers: [ReferralRewardService],
  controllers: [ReferralRewardController],
  exports: [ReferralRewardService],
})
export class ReferralRewardModule {}
