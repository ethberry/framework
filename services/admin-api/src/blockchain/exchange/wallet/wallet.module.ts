import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { PayeesEntity } from "./payees.entity";
import { PayeesService } from "./payees.service";
import { BalanceModule } from "../../hierarchy/balance/balance.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, BalanceModule, TypeOrmModule.forFeature([PayeesEntity])],
  controllers: [WalletController],
  providers: [WalletService, PayeesService],
  exports: [WalletService, PayeesService],
})
export class WalletModule {}
