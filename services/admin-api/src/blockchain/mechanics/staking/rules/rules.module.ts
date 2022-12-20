import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingRulesService } from "./rules.service";
import { StakingRulesController } from "./rules.controller";
import { StakingRulesEntity } from "./rules.entity";
import { StakingDepositModule } from "../deposit/deposit.module";
import { AssetModule } from "../../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, StakingDepositModule, TypeOrmModule.forFeature([StakingRulesEntity])],
  providers: [StakingRulesService],
  controllers: [StakingRulesController],
  exports: [StakingRulesService],
})
export class StakingRulesModule {}
