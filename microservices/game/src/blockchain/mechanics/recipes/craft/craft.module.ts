import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../../infrastructure/settings/settings.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { CraftService } from "./craft.service";
import { CraftController } from "./craft.controller";
import { CraftEntity } from "./craft.entity";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, TypeOrmModule.forFeature([CraftEntity])],
  providers: [Logger, CraftService],
  controllers: [CraftController],
  exports: [CraftService],
})
export class CraftModule {}
