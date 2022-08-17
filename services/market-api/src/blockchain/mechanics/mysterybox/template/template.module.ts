import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MysteryboxTemplateService } from "./template.service";
import { MysteryboxTemplateController } from "./template.controller";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [MysteryboxTemplateService],
  controllers: [MysteryboxTemplateController],
  exports: [MysteryboxTemplateService],
})
export class MysteryboxTemplateModule {}
