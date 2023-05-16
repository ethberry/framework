import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CollectionTemplateService } from "./template.service";
import { Erc721CollectionController } from "./template.controller";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { CollectionTokenModule } from "../token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity]), AssetModule, CollectionTokenModule],
  providers: [Logger, CollectionTemplateService],
  controllers: [Erc721CollectionController],
  exports: [CollectionTemplateService],
})
export class CollectionTemplateModule {}
