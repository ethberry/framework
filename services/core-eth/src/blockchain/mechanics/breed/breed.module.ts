import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BreedServiceEth } from "./breed.service.eth";
import { BreedService } from "./breed.service";
import { BreedEntity } from "./breed.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BreedEntity]), ConfigModule],
  providers: [Logger, BreedService, BreedServiceEth],
  exports: [BreedService, BreedServiceEth],
})
export class BreedModule {}
