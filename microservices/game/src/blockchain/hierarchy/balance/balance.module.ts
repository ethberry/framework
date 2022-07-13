import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BalanceEntity } from "./balance.entity";
import { BalanceService } from "./balance.service";

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity])],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
