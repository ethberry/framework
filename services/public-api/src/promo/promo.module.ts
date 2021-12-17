import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PromoService } from "./promo.service";
import { PromoEntity } from "./promo.entity";
import { PromoController } from "./promo.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PromoEntity])],
  providers: [PromoService],
  controllers: [PromoController],
  exports: [PromoService],
})
export class PromoModule {}
