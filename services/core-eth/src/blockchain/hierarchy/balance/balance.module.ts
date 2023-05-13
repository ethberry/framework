import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BalanceService } from "./balance.service";
import { BalanceEntity } from "./balance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity])],
  providers: [Logger, BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
