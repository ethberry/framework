import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingHistoryService } from "./staking-history.service";
import { StakingHistoryEntity } from "./staking-history.entity";
import { StakingHistoryController } from "./staking-history.controller";

@Module({
  imports: [TypeOrmModule.forFeature([StakingHistoryEntity])],
  providers: [StakingHistoryService],
  controllers: [StakingHistoryController],
  exports: [StakingHistoryService],
})
export class StakingHistoryModule {}
