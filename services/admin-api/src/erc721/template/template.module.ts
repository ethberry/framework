import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TemplateService } from "./template.service";
import { Erc721TemplateEntity } from "./template.entity";
import { Erc721TemplateController } from "./template.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721TemplateEntity])],
  providers: [Erc721TemplateService],
  controllers: [Erc721TemplateController],
  exports: [Erc721TemplateService],
})
export class Erc721TemplateModule {}
