import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementItemEntity } from "./item.entity";
import { AchievementsItemService } from "./item.service";

@Module({
  imports: [TypeOrmModule.forFeature([AchievementItemEntity])],
  providers: [AchievementsItemService],
  exports: [AchievementsItemService],
})
export class AchievementItemModule {}
