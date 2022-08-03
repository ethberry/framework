import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingHistoryService } from "./history.service";
import { StakingHistoryEntity } from "./history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StakingHistoryEntity])],
  providers: [StakingHistoryService],
  exports: [StakingHistoryService],
})
export class StakingHistoryModule {}
