import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryHistoryEntity } from "./history.entity";
import { LotteryHistoryService } from "./history.service";

@Module({
  imports: [TypeOrmModule.forFeature([LotteryHistoryEntity])],
  providers: [LotteryHistoryService],
  exports: [LotteryHistoryService],
})
export class LotteryHistoryModule {}
