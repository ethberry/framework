import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementRuleEntity } from "./rule.entity";
import { AchievementRuleController } from "./rule.controller";
import { AchievementRuleService } from "./rule.service";
import { AssetModule } from "../../blockchain/exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([AchievementRuleEntity])],
  providers: [AchievementRuleService],
  controllers: [AchievementRuleController],
  exports: [AchievementRuleService],
})
export class AchievementRuleModule {}
