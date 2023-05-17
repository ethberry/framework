import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementItemEntity } from "./item.entity";
import { AchievementItemService } from "./item.service";
import { AchievementItemController } from "./item.controller";

@Module({
  imports: [TypeOrmModule.forFeature([AchievementItemEntity])],
  providers: [AchievementItemService],
  controllers: [AchievementItemController],
  exports: [AchievementItemService],
})
export class AchievementItemModule {}
