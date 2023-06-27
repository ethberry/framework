import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { Erc998TokenModule } from "../token/token.module";
import { Erc998TemplateService } from "./template.service";
import { Erc998TemplateController } from "./template.controller";

@Module({
  imports: [AssetModule, Erc998TokenModule, ContractModule, TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc998TemplateService],
  controllers: [Erc998TemplateController],
  exports: [Erc998TemplateService],
})
export class Erc998TemplateModule {}
