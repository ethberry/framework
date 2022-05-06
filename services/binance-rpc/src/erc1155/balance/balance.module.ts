import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155BalanceEntity } from "./balance.entity";
import { Erc1155BalanceService } from "./balance.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc1155BalanceEntity])],
  providers: [Erc1155BalanceService],
  exports: [Erc1155BalanceService],
})
export class Erc1155BalanceModule {}
