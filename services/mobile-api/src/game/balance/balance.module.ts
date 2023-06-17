import { Logger, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { BalanceService } from "./balance.service";
import { BalanceEntity } from "./balance.entity";
import { BalanceController } from "./balance.controller";

@Module({
  imports: [HttpModule, ConfigModule, TypeOrmModule.forFeature([BalanceEntity])],
  providers: [Logger, BalanceService],
  controllers: [BalanceController],
  exports: [BalanceService],
})
export class BalanceModule {}
