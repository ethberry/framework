import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { BreedService } from "./breed.service";
import { BreedController } from "./breed.controller";
import { TokenModule } from "../../hierarchy/token/token.module";
import { TemplateModule } from "../../hierarchy/template/template.module";

@Module({
  imports: [SignerModule, TokenModule, TemplateModule],
  providers: [Logger, BreedService],
  controllers: [BreedController],
  exports: [BreedService],
})
export class BreedModule {}
