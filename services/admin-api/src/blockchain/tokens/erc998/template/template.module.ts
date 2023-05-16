import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TemplateService } from "./template.service";
import { Erc998TemplateController } from "./template.controller";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { Erc998TokenModule } from "../token/token.module";
import { AssetModule } from "../../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, Erc998TokenModule, TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc998TemplateService],
  controllers: [Erc998TemplateController],
  exports: [Erc998TemplateService],
})
export class Erc998TemplateModule {}
