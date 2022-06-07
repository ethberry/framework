import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TemplateService } from "./template.service";
import { Erc721TemplateEntity } from "./template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721TemplateEntity])],
  providers: [Erc721TemplateService],
  exports: [Erc721TemplateService],
})
export class Erc721TemplateModule {}
