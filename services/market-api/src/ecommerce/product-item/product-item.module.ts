import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductItemService } from "./product-item.service";
import { ProductItemEntity } from "./product-item.entity";
import { ProductItemController } from "./product-item.controller";
import { PhotoModule } from "../photo/photo.module";
import { AssetModule } from "../../blockchain/exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([ProductItemEntity]), PhotoModule],
  providers: [ProductItemService],
  controllers: [ProductItemController],
  exports: [ProductItemService],
})
export class ProductItemModule {}
