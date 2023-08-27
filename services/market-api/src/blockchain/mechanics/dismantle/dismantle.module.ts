import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../infrastructure/settings/settings.module";
import { DismantleService } from "./dismantle.service";
import { DismantleController } from "./dismantle.controller";
import { DismantleEntity } from "./dismantle.entity";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, TypeOrmModule.forFeature([DismantleEntity])],
  providers: [Logger, DismantleService],
  controllers: [DismantleController],
  exports: [DismantleService],
})
export class DismantleModule {}
