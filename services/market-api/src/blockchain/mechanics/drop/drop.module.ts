import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../infrastructure/settings/settings.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { DropEntity } from "./drop.entity";
import { DropService } from "./drop.service";
import { DropController } from "./drop.controller";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, TemplateModule, TypeOrmModule.forFeature([DropEntity])],
  providers: [Logger, DropService],
  controllers: [DropController],
  exports: [DropService],
})
export class DropModule {}
