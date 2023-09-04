import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../../infrastructure/settings/settings.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { DismantleService } from "./dismantle.service";
import { DismantleEntity } from "./dismantle.entity";
import { DismantleController } from "./dismantle.controller";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, TokenModule, TypeOrmModule.forFeature([DismantleEntity])],
  providers: [Logger, DismantleService],
  controllers: [DismantleController],
  exports: [DismantleService],
})
export class DismantleModule {}
