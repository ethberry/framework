import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetModule } from "../../blockchain/exchange/asset/asset.module";
import { AchievementRuleModule } from "../rule/rule.module";
import { AchievementLevelEntity } from "./level.entity";
import { AchievementLevelService } from "./level.service";
import { AchievementLevelController } from "./level.controller";

@Module({
  imports: [AssetModule, AchievementRuleModule, TypeOrmModule.forFeature([AchievementLevelEntity])],
  providers: [AchievementLevelService],
  controllers: [AchievementLevelController],
  exports: [AchievementLevelService],
})
export class AchievementLevelModule {}
