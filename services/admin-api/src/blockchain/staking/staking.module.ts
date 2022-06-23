import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingService } from "./staking.service";
import { StakingController } from "./staking.controller";
import { StakingHistoryModule } from "./staking-history/staking-history.module";
import { StakingRuleEntity } from "./staking.entity";
import { StakesModule } from "./stakes/stakes.module";

@Module({
  imports: [StakingHistoryModule, StakesModule, TypeOrmModule.forFeature([StakingRuleEntity])],
  providers: [StakingService],
  controllers: [StakingController],
  exports: [StakingService],
})
export class StakingModule {}
