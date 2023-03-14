import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { CartItemModule } from "../cart-item/cart-item.module";
import { CartEntity } from "./cart.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity]), CartItemModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
