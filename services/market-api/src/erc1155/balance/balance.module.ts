import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155BalanceService } from "./balance.service";
import { Erc1155BalanceController } from "./balance.controller";
import { UniBalanceEntity } from "../../blockchain/uni-token/uni-balance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniBalanceEntity])],
  providers: [Erc1155BalanceService],
  controllers: [Erc1155BalanceController],
  exports: [Erc1155BalanceService],
})
export class Erc1155BalanceModule {}
