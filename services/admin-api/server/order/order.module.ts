import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {OrderService} from "./order.service";
import {OrderEntity} from "./order.entity";
import {OrderController} from "./order.controller";
import {ProductModule} from "../product/product.module";

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), ProductModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
