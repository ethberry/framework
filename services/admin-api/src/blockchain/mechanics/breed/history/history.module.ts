import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BreedHistoryService } from "./history.service";
import { BreedHistoryController } from "./history.controller";
import { BreedHistoryEntity } from "./history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BreedHistoryEntity])],
  providers: [Logger, BreedHistoryService],
  controllers: [BreedHistoryController],
  exports: [BreedHistoryService],
})
export class BreedHistoryModule {}
