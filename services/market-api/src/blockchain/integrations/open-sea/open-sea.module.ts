import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { OpenSeaService } from "./open-sea.service";
import { OpenSeaController } from "./open-sea.controller";

@Module({
  imports: [ConfigModule, TokenModule, ContractModule],
  providers: [Logger, OpenSeaService],
  controllers: [OpenSeaController],
  exports: [OpenSeaService],
})
export class OpenSeaModule {}
