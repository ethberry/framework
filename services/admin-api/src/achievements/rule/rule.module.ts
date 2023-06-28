import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";
import { AssetModule } from "../../blockchain/exchange/asset/asset.module";
import { AchievementRuleEntity } from "./rule.entity";
import { AchievementRuleController } from "./rule.controller";
import { AchievementRuleService } from "./rule.service";

@Module({
  imports: [AssetModule, ContractModule, TypeOrmModule.forFeature([AchievementRuleEntity])],
  providers: [AchievementRuleService],
  controllers: [AchievementRuleController],
  exports: [AchievementRuleService],
})
export class AchievementRuleModule {}
