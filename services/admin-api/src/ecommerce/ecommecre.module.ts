import { Module } from "@nestjs/common";

import { AddressModule } from "./address/address.module";
import { CategoryModule } from "./category/category.module";
import { OrderModule } from "./order/order.module";
import { ParameterModule } from "./parameter/parameter.module";
import { PhotoModule } from "./photo/photo.module";
import { ProductModule } from "./product/product.module";
import { PromoModule } from "./promo/promo.module";

@Module({
  imports: [AddressModule, CategoryModule, OrderModule, ParameterModule, PhotoModule, ProductModule, PromoModule],
})
export class EcommerceModule {}
