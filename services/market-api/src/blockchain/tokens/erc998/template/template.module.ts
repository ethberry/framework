import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TemplateService } from "./template.service";
import { Erc998TemplateController } from "./template.controller";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc998TemplateService],
  controllers: [Erc998TemplateController],
  exports: [Erc998TemplateService],
})
export class Erc998TemplateModule {}
