import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155BalanceService } from "./balance.service";
import { BalanceEntity } from "../../blockchain/hierarchy/balance/balance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity])],
  providers: [Erc1155BalanceService],
  exports: [Erc1155BalanceService],
})
export class Erc1155BalanceModule {}
