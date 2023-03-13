import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OrderService } from "./order.service";
import { OrderEntity } from "./order.entity";
import { OrderController } from "./order.controller";
import { OrderItemModule } from "../order-item/order-item.module";
import { AddressModule } from "../address/address.module";
import { CartModule } from "../cart/cart.module";
import { AuthModule } from "../../infrastructure/auth/auth.module";
import { UserModule } from "../../infrastructure/user/user.module";
import { ProductModule } from "../product/product.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    AuthModule,
    AddressModule,
    CartModule,
    OrderItemModule,
    ProductModule,
    UserModule,
    ConfigModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
