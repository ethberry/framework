import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { MysteryboxBoxEntity } from "./box.entity";
import { MysteryboxBoxService } from "./box.service";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysteryboxBoxController } from "./box.controller";

@Module({
  imports: [SignerModule, TemplateModule, ConfigModule, TypeOrmModule.forFeature([MysteryboxBoxEntity])],
  providers: [Logger, MysteryboxBoxService],
  controllers: [MysteryboxBoxController],
  exports: [MysteryboxBoxService],
})
export class MysteryboxBoxModule {}
