import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CartItemService } from "./cart-item.service";
import { CartItemEntity } from "./cart-item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity])],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
