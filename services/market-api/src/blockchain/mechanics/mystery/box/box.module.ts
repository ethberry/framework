import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxService } from "./box.service";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysteryBoxController } from "./box.controller";

@Module({
  imports: [TemplateModule, ConfigModule, TypeOrmModule.forFeature([MysteryBoxEntity])],
  providers: [Logger, MysteryBoxService],
  controllers: [MysteryBoxController],
  exports: [MysteryBoxService],
})
export class MysteryBoxModule {}
