import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingRulesService } from "./staking-rules.service";
import { StakingRulesController } from "./staking-rules.controller";
import { StakingRulesEntity } from "./staking-rules.entity";
import { StakingHistoryModule } from "../staking-history/staking-history.module";

@Module({
  imports: [StakingHistoryModule, TypeOrmModule.forFeature([StakingRulesEntity])],
  providers: [StakingRulesService],
  controllers: [StakingRulesController],
  exports: [StakingRulesService],
})
export class StakingRulesModule {}
