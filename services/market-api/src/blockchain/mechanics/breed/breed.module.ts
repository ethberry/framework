import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { BreedService } from "./breed.service";
import { BreedController } from "./breed.controller";
import { TokenModule } from "../../hierarchy/token/token.module";

@Module({
  imports: [SignerModule, TokenModule],
  providers: [Logger, BreedService],
  controllers: [BreedController],
  exports: [BreedService],
})
export class BreedModule {}
