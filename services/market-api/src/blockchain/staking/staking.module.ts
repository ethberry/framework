import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingService } from "./staking.service";
import { StakingController } from "./staking.controller";
import { StakingRuleEntity } from "./staking.entity";
import { StakingHistoryModule } from "./staking-history/staking-history.module";
import { StakesModule } from "./stakes/stakes.module";

@Module({
  imports: [StakesModule, StakingHistoryModule, TypeOrmModule.forFeature([StakingRuleEntity])],
  providers: [StakingService],
  controllers: [StakingController],
  exports: [StakingService],
})
export class StakingModule {}
