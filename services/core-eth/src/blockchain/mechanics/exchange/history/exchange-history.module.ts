import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ExchangeHistoryEntity } from "./exchange-history.entity";
import { ExchangeHistoryService } from "./exchange-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeHistoryEntity])],
  providers: [ExchangeHistoryService],
  exports: [ExchangeHistoryService],
})
export class ExchangeHistoryModule {}
