import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractManagerHistoryService } from "./history.service";
import { ContractManagerHistoryEntity } from "./history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractManagerHistoryEntity])],
  providers: [ContractManagerHistoryService],
  exports: [ContractManagerHistoryService],
})
export class ContractManagerHistoryModule {}
