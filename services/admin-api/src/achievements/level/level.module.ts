import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementLevelEntity } from "./level.entity";
import { AchievementLevelService } from "./level.service";
import { AchievementLevelController } from "./level.controller";

@Module({
  imports: [TypeOrmModule.forFeature([AchievementLevelEntity])],
  providers: [AchievementLevelService],
  controllers: [AchievementLevelController],
  exports: [AchievementLevelService],
})
export class AchievementLevelModule {}
