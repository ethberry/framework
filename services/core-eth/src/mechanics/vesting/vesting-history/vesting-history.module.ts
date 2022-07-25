import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VestingHistoryService } from "./vesting-history.service";
import { VestingHistoryEntity } from "./vesting-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([VestingHistoryEntity])],
  providers: [VestingHistoryService],
  exports: [VestingHistoryService],
})
export class VestingHistoryModule {}
