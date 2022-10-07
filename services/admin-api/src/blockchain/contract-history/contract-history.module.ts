import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractHistoryEntity } from "./contract-history.entity";
import { ContractHistoryService } from "./contract-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([ContractHistoryEntity])],
  providers: [ContractHistoryService],
  exports: [ContractHistoryService],
})
export class ContractHistoryModule {}
