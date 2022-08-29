import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TemplateService } from "./template.service";
import { Erc721TemplateController } from "./template.controller";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc721TemplateService],
  controllers: [Erc721TemplateController],
  exports: [Erc721TemplateService],
})
export class Erc721TemplateModule {}
