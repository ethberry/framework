import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductPromoService } from "./promo.service";
import { ProductPromoEntity } from "./promo.entity";
import { ProductPromoController } from "./promo.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ProductPromoEntity])],
  providers: [ProductPromoService],
  controllers: [ProductPromoController],
  exports: [ProductPromoService],
})
export class ProductPromoModule {}
