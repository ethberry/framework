import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysteryboxSignService } from "./sign.service";
import { MysteryboxSignController } from "./sign.controller";
import { MysteryboxBoxModule } from "../mysterybox/mysterybox.module";

@Module({
  imports: [SignerModule, TemplateModule, MysteryboxBoxModule],
  providers: [Logger, MysteryboxSignService],
  controllers: [MysteryboxSignController],
  exports: [MysteryboxSignService],
})
export class MysteryboxSignModule {}
