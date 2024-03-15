import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { CollectionTokenModule } from "../token/token.module";
import { CollectionTemplateService } from "./template.service";
import { Erc721CollectionController } from "./template.controller";
import { MysteryBoxModule } from "../../mystery/box/box.module";
import { ClaimTemplateModule } from "../../claim/template/template.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateEntity]),
    AssetModule,
    CollectionTokenModule,
    ContractModule,
    MysteryBoxModule,
    ClaimTemplateModule,
  ],
  providers: [CollectionTemplateService],
  controllers: [Erc721CollectionController],
  exports: [CollectionTemplateService],
})
export class CollectionTemplateModule {}
