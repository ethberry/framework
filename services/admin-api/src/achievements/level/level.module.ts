import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementLevelEntity } from "./level.entity";
import { AchievementLevelService } from "./level.service";
import { AchievementLevelController } from "./level.controller";
import { AssetModule } from "../../blockchain/exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([AchievementLevelEntity])],
  providers: [AchievementLevelService],
  controllers: [AchievementLevelController],
  exports: [AchievementLevelService],
})
export class AchievementLevelModule {}
