import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../../infrastructure/settings/settings.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BreedService } from "./breed.service";
import { BreedController } from "./breed.controller";
import { BreedEntity } from "./breed.entity";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [
    SettingsModule,
    SignerModule,
    ContractModule,
    TokenModule,
    TemplateModule,
    TypeOrmModule.forFeature([BreedEntity]),
  ],
  providers: [Logger, BreedService],
  controllers: [BreedController],
  exports: [BreedService],
})
export class BreedModule {}
