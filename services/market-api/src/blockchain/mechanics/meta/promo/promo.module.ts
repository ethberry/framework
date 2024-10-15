import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MarketplaceModule } from "../../../exchange/marketplace/marketplace.module";
import { AssetPromoEntity } from "./promo.entity";
import { AssetPromoService } from "./promo.service";
import { AssetPromoController } from "./promo.controller";

@Module({
  imports: [MarketplaceModule, TypeOrmModule.forFeature([AssetPromoEntity])],
  providers: [Logger, AssetPromoService],
  controllers: [AssetPromoController],
  exports: [AssetPromoService],
})
export class AssetPromoModule {}
