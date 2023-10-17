import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetPromoEntity } from "./promo.entity";
import { AssetPromoService } from "./promo.service";
import { AssetPromoController } from "./promo.controller";
import { AssetModule } from "../../exchange/asset/asset.module";

@Module({
  imports: [AssetModule, TypeOrmModule.forFeature([AssetPromoEntity])],
  providers: [AssetPromoService],
  controllers: [AssetPromoController],
  exports: [AssetPromoService],
})
export class AssetPromoModule {}
