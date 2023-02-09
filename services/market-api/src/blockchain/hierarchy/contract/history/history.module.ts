import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractHistoryEntity } from "./history.entity";
import { ContractHistoryService } from "./history.service";

@Module({
  imports: [TypeOrmModule.forFeature([ContractHistoryEntity])],
  providers: [ContractHistoryService],
  exports: [ContractHistoryService],
})
export class ContractHistoryModule {}
