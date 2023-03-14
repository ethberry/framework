import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderItemService } from "./order-item.service";
import { OrderItemEntity } from "./order-item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemEntity])],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
