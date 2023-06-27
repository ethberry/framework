import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { Erc1155TokenModule } from "../token/token.module";
import { Erc1155TemplateService } from "./template.service";
import { Erc1155TemplateController } from "./template.controller";

@Module({
  imports: [Erc1155TokenModule, AssetModule, ContractModule, TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc1155TemplateService],
  controllers: [Erc1155TemplateController],
  exports: [Erc1155TemplateService],
})
export class Erc1155TemplateModule {}
