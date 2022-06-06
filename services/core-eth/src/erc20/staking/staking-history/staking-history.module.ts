import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20StakingHistoryService } from "./staking-history.service";
import { Erc20StakingHistoryEntity } from "./staking-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc20StakingHistoryEntity])],
  providers: [Erc20StakingHistoryService],
  exports: [Erc20StakingHistoryService],
})
export class Erc20StakingHistoryModule {}
