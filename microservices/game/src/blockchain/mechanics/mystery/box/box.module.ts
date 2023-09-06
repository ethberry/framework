import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxService } from "./box.service";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysteryBoxController } from "./box.controller";

@Module({
  imports: [TemplateModule, TypeOrmModule.forFeature([MysteryBoxEntity])],
  providers: [Logger, MysteryBoxService],
  controllers: [MysteryBoxController],
  exports: [MysteryBoxService],
})
export class MysteryBoxModule {}
