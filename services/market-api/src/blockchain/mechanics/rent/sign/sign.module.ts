import { Logger, Module } from "@nestjs/common";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysterySignService } from "./sign.service";
import { MysterySignController } from "./sign.controller";

@Module({
  imports: [SignerModule, TemplateModule],
  providers: [Logger, MysterySignService],
  controllers: [MysterySignController],
  exports: [MysterySignService],
})
export class RentSignModule {}
