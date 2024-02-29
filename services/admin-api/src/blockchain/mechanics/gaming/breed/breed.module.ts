import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BreedService } from "./breed.service";
import { BreedController } from "./breed.controller";
import { BreedEntity } from "./breed.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BreedEntity])],
  providers: [Logger, BreedService],
  controllers: [BreedController],
  exports: [BreedService],
})
export class BreedModule {}
