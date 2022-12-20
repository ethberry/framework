import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TemplateService } from "./template.service";
import { Erc721TemplateController } from "./template.controller";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { AssetModule } from "../../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc721TemplateService],
  controllers: [Erc721TemplateController],
  exports: [Erc721TemplateService],
})
export class Erc721TemplateModule {}
