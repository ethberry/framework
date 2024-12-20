import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155TemplateService } from "./template.service";
import { Erc1155TemplateController } from "./template.controller";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc1155TemplateService],
  controllers: [Erc1155TemplateController],
  exports: [Erc1155TemplateService],
})
export class Erc1155TemplateModule {}
