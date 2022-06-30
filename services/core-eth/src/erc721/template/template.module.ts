import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TemplateService } from "./template.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc721TemplateService],
  exports: [Erc721TemplateService],
})
export class Erc721TemplateModule {}
