import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BreedHistoryService } from "./breed-history.service";
import { BreedHistoryController } from "./breed-history.controller";
import { BreedHistoryEntity } from "./breed-history.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BreedHistoryEntity])],
  providers: [Logger, BreedHistoryService],
  controllers: [BreedHistoryController],
  exports: [BreedHistoryService],
})
export class BreedHistoryModule {}
