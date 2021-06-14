import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {ProductService} from "./product.service";
import {ProductEntity} from "./product.entity";
import {ProductController} from "./product.controller";
import {PhotoModule} from "../photo/photo.module";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), PhotoModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
