import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { Erc721TokenModule } from "../token/token.module";
import { Erc721TemplateService } from "./template.service";
import { Erc721TemplateController } from "./template.controller";
import { TemplateDeleteModule } from "../../../hierarchy/template/template.delete.module";

@Module({
  imports: [
    AssetModule,
    Erc721TokenModule,
    ContractModule,
    TypeOrmModule.forFeature([TemplateEntity]),
    TemplateDeleteModule,
  ],
  providers: [Erc721TemplateService],
  controllers: [Erc721TemplateController],
  exports: [Erc721TemplateService],
})
export class Erc721TemplateModule {}
