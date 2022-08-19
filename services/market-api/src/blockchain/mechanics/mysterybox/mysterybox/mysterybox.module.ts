import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { MysteryboxEntity } from "./mysterybox.entity";
import { MysteryboxBoxService } from "./mysterybox.service";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysteryboxBoxController } from "./mysterybox.controller";

@Module({
  imports: [SignerModule, TemplateModule, TypeOrmModule.forFeature([MysteryboxEntity])],
  providers: [Logger, MysteryboxBoxService],
  controllers: [MysteryboxBoxController],
  exports: [MysteryboxBoxService],
})
export class MysteryboxBoxModule {}
