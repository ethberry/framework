import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BreedService } from "./breed.service";
import { BreedController } from "./breed.controller";
import { TokenModule } from "../../hierarchy/token/token.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { BreedEntity } from "./breed.entity";
import { BreedHistoryEntity } from "./history.entity";

@Module({
  imports: [
    TokenModule,
    TemplateModule,
    TypeOrmModule.forFeature([BreedEntity]),
    TypeOrmModule.forFeature([BreedHistoryEntity]),
  ],
  providers: [Logger, BreedService],
  controllers: [BreedController],
  exports: [BreedService],
})
export class BreedModule {}
