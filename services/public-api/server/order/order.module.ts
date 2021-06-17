import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

import {OrderService} from "./order.service";
import {OrderEntity} from "./order.entity";
import {OrderController} from "./order.controller";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";
import {ProductModule} from "../product/product.module";

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), AuthModule, ProductModule, UserModule, ConfigModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
