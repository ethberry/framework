import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementItemEntity } from "./item.entity";
import { AchievementItemService } from "./item.service";

@Module({
  imports: [TypeOrmModule.forFeature([AchievementItemEntity])],
  providers: [AchievementItemService],
  exports: [AchievementItemService],
})
export class AchievementItemModule {}
