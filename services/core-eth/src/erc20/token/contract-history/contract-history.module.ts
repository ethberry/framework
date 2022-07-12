import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20ContractHistoryEntity } from "./contract-history.entity";
import { Erc20ContractHistoryService } from "./contract-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc20ContractHistoryEntity])],
  providers: [Erc20ContractHistoryService],
  exports: [Erc20ContractHistoryService],
})
export class Erc20ContractHistoryModule {}
