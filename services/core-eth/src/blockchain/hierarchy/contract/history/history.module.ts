import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractHistoryEntity } from "./history.entity";
import { ContractHistoryService } from "./history.service";
import { ContractModule } from "../contract.module";

@Module({
  imports: [ContractModule, TypeOrmModule.forFeature([ContractHistoryEntity])],
  providers: [Logger, ContractHistoryService],
  exports: [ContractHistoryService],
})
export class ContractHistoryModule {}
