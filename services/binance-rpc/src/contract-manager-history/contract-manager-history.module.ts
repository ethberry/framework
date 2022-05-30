import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerHistoryService } from "./contract-manager-history.service";
import { ContractManagerHistoryEntity } from "./contract-manager-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractManagerHistoryEntity])],
  providers: [ContractManagerHistoryService],
  exports: [ContractManagerHistoryService],
})
export class ContractManagerHistoryModule {}
