import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BreedService } from "./breed.service";
import { BreedController } from "./breed.controller";
import { BreedEntity } from "./breed.entity";
import { BreedHistoryModule } from "./history/breed-history.module";

@Module({
  imports: [BreedHistoryModule, TypeOrmModule.forFeature([BreedEntity])],
  providers: [Logger, BreedService],
  controllers: [BreedController],
  exports: [BreedService],
})
export class BreedModule {}
