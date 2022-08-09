import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TemplateService } from "./template.service";
import { Erc998TemplateController } from "./template.controller";
import { TemplateEntity } from "../../../blockchain/hierarchy/template/template.entity";
import { AssetModule } from "../../../mechanics/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc998TemplateService],
  controllers: [Erc998TemplateController],
  exports: [Erc998TemplateService],
})
export class Erc998TemplateModule {}
