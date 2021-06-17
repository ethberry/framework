import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {CategoryService} from "./category.service";
import {CategoryEntity} from "./category.entity";
import {CategoryController} from "./category.controller";
import {ProductModule} from "../product/product.module";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), ProductModule],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
