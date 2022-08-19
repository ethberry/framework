import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingRulesService } from "./rules.service";
import { StakingRulesController } from "./rules.controller";
import { StakingRulesEntity } from "./rules.entity";
import { StakingStakesModule } from "../stakes/stakes.module";
import { AssetModule } from "../../asset/asset.module";

@Module({
  imports: [AssetModule, StakingStakesModule, TypeOrmModule.forFeature([StakingRulesEntity])],
  providers: [StakingRulesService],
  controllers: [StakingRulesController],
  exports: [StakingRulesService],
})
export class StakingRulesModule {}
