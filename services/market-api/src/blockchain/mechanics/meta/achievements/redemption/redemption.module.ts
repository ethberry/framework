import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementRedemptionService } from "./redemption.service";
import { AchievementRedemptionEntity } from "./redemption.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AchievementRedemptionEntity])],
  providers: [AchievementRedemptionService],
  exports: [AchievementRedemptionService],
})
export class AchievementRedemptionModule {}
