import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerHistoryService } from "./contract-manager-history.service";
import { Erc20StakingHistoryEntity } from "../../erc20/staking-history/staking-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc20StakingHistoryEntity])],
  providers: [ContractManagerHistoryService],
  exports: [ContractManagerHistoryService],
})
export class ContractManagerHistoryModule {}
