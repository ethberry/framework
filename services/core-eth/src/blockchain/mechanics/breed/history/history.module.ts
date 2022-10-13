import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BreedHistoryEntity } from "./history.entity";
import { BreedHistoryService } from "./history.service";
import { ContractHistoryModule } from "../../../contract-history/contract-history.module";

@Module({
  imports: [TypeOrmModule.forFeature([BreedHistoryEntity]), ContractHistoryModule],
  providers: [BreedHistoryService],
  exports: [BreedHistoryService],
})
export class BreedHistoryModule {}
