import { Module } from "@nestjs/common";

import { AddressModule } from "./address/address.module";
import { CategoryModule } from "./category/category.module";
import { CustomParameterModule } from "./custom-parameter/custom-parameter.module";
import { OrderModule } from "./order/order.module";
import { ParameterModule } from "./parameter/parameter.module";
import { PhotoModule } from "./photo/photo.module";
import { ProductModule } from "./product/product.module";
import { ProductItemModule } from "./product-item/product-item.module";
import { ProductItemParameterModule } from "./product-item-parameter/product-item-parameter.module";
import { PromoModule } from "./promo/promo.module";
import { StockModule } from "./stock/stock.module";

@Module({
  imports: [
    AddressModule,
    CategoryModule,
    CustomParameterModule,
    OrderModule,
    ParameterModule,
    PhotoModule,
    ProductModule,
    ProductItemModule,
    ProductItemParameterModule,
    PromoModule,
    StockModule,
  ],
})
export class EcommerceModule {}
