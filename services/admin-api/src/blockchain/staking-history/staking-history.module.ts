import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingHistoryService } from "./staking-history.service";
import { StakingHistoryEntity } from "./staking-history.entity";
import { StakingController } from "./staking-history.controller";

@Module({
  imports: [TypeOrmModule.forFeature([StakingHistoryEntity])],
  providers: [StakingHistoryService],
  controllers: [StakingController],
  exports: [StakingHistoryService],
})
export class StakingHistoryModule {}
