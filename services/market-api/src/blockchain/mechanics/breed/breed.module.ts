import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { BreedService } from "./breed.service";
import { BreedController } from "./breed.controller";
import { TokenModule } from "../../hierarchy/token/token.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { BreedEntity } from "./breed.entity";

@Module({
  imports: [SignerModule, TokenModule, TemplateModule, TypeOrmModule.forFeature([BreedEntity])],
  providers: [Logger, BreedService],
  controllers: [BreedController],
  exports: [BreedService],
})
export class BreedModule {}
