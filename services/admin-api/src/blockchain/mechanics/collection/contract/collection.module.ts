import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721CollectionService } from "./collection.service";
import { Erc721CollectionController } from "./collection.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractEntity]),
    TypeOrmModule.forFeature([TemplateEntity]),
    TypeOrmModule.forFeature([TokenEntity]),
    TemplateModule,
    TokenModule,
  ],
  providers: [Logger, Erc721CollectionService],
  controllers: [Erc721CollectionController],
  exports: [Erc721CollectionService],
})
export class CollectionModule {}
