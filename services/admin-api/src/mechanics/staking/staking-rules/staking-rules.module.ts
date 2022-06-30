import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingRulesService } from "./staking-rules.service";
import { StakingRulesController } from "./staking-rules.controller";
import { StakingHistoryModule } from "../staking-history/staking-history.module";
import { StakingRulesEntity } from "./staking-rules.entity";
import { StakingStakesModule } from "../staking-stakes/staking-stakes.module";

@Module({
  imports: [StakingHistoryModule, StakingStakesModule, TypeOrmModule.forFeature([StakingRulesEntity])],
  providers: [StakingRulesService],
  controllers: [StakingRulesController],
  exports: [StakingRulesService],
})
export class StakingRulesModule {}
