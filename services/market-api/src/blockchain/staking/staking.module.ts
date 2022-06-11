import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingService } from "./staking.service";
import { StakingController } from "./staking.controller";
import { StakingEntity } from "./staking.entity";
import { StakingHistoryModule } from "./staking-history/staking-history.module";

@Module({
  imports: [StakingHistoryModule, TypeOrmModule.forFeature([StakingEntity])],
  providers: [StakingService],
  controllers: [StakingController],
  exports: [StakingService],
})
export class StakingModule {}
