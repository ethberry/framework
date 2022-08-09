import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155TemplateService } from "./template.service";
import { Erc1155TemplateController } from "./template.controller";
import { Erc1155TokenModule } from "../token/token.module";
import { TemplateEntity } from "../../../blockchain/hierarchy/template/template.entity";
import { AssetModule } from "../../../mechanics/asset/asset.module";

@Module({
  imports: [AssetModule, Erc1155TokenModule, TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc1155TemplateService],
  controllers: [Erc1155TemplateController],
  exports: [Erc1155TemplateService],
})
export class Erc1155TemplateModule {}
