import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementLevelService } from "./level.service";
import { AchievementLevelEntity } from "./level.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AchievementLevelEntity])],
  providers: [AchievementLevelService],
  exports: [AchievementLevelService],
})
export class AchievementLevelModule {}
