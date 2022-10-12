import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BreedHistoryEntity } from "./history.entity";
import { BreedHistoryService } from "./history.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreedHistoryEntity])],
  providers: [BreedHistoryService],
  exports: [BreedHistoryService],
})
export class BreedHistoryModule {}
