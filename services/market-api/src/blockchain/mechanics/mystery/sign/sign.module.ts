import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../../infrastructure/settings/settings.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysterySignService } from "./sign.service";
import { MysterySignController } from "./sign.controller";
import { MysteryBoxModule } from "../box/box.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [SettingsModule, SignerModule, ContractModule, TemplateModule, MysteryBoxModule],
  providers: [Logger, MysterySignService],
  controllers: [MysterySignController],
  exports: [MysterySignService],
})
export class MysterySignModule {}
