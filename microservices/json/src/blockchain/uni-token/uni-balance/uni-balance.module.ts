import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UniBalanceEntity } from "./uni-balance.entity";
import { UniBalanceService } from "./uni-balance.service";

@Module({
  imports: [TypeOrmModule.forFeature([UniBalanceEntity])],
  providers: [UniBalanceService],
  exports: [UniBalanceService],
})
export class UniBalanceModule {}
