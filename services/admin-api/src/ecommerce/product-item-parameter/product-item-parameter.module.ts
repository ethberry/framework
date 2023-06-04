import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductItemParameterEntity } from "./product-item-parameter.entity";
import { ProductItemParameterService } from "./product-item-parameter.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProductItemParameterEntity])],
  providers: [ProductItemParameterService],
  exports: [ProductItemParameterService],
})
export class ProductItemParameterModule {}
