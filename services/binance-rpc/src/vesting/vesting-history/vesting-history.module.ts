import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20VestingHistoryService } from "./vesting-history.service";
import { Erc20VestingHistoryEntity } from "./vesting-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc20VestingHistoryEntity])],
  providers: [Erc20VestingHistoryService],
  exports: [Erc20VestingHistoryService],
})
export class Erc20VestingHistoryModule {}
