import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxService } from "./box.service";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysteryBoxController } from "./box.controller";

@Module({
  imports: [SignerModule, TemplateModule, ConfigModule, TypeOrmModule.forFeature([MysteryBoxEntity])],
  providers: [Logger, MysteryBoxService],
  controllers: [MysteryBoxController],
  exports: [MysteryBoxService],
})
export class MysteryBoxModule {}
