import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysterySignService } from "./sign.service";
import { MysterySignController } from "./sign.controller";
import { MysteryBoxModule } from "../box/box.module";

@Module({
  imports: [SignerModule, TemplateModule, MysteryBoxModule],
  providers: [Logger, MysterySignService],
  controllers: [MysterySignController],
  exports: [MysterySignService],
})
export class MysterySignModule {}
