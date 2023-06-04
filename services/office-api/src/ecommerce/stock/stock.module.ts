import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StockService } from "./stock.service";
import { StockEntity } from "./stock.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity])],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
