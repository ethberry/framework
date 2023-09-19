import { Module } from "@nestjs/common";

import { CategoryModule } from "./category/category.module";
import { OrderModule } from "./order/order.module";
import { PhotoModule } from "./photo/photo.module";
import { ProductModule } from "./product/product.module";
import { ProductPromoModule } from "./promo/promo.module";
import { CartModule } from "./cart/cart.module";

@Module({
  imports: [CartModule, CategoryModule, OrderModule, PhotoModule, ProductModule, ProductPromoModule],
})
export class EcommerceModule {}
