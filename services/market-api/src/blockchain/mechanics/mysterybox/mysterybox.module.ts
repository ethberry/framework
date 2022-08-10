import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { MysteryboxEntity } from "./mysterybox.entity";
import { MysteryboxService } from "./mysterybox.service";
import { MysteryboxController } from "./mysterybox.controller";
import { TemplateModule } from "../../hierarchy/template/template.module";

@Module({
  imports: [SignerModule, TemplateModule, TypeOrmModule.forFeature([MysteryboxEntity])],
  providers: [Logger, MysteryboxService],
  controllers: [MysteryboxController],
  exports: [MysteryboxService],
})
export class MysteryboxModule {}
