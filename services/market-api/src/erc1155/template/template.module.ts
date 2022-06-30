import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155TemplateService } from "./template.service";
import { Erc1155TokenController } from "./template.controller";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc1155TemplateService],
  controllers: [Erc1155TokenController],
  exports: [Erc1155TemplateService],
})
export class Erc1155TemplateModule {}
