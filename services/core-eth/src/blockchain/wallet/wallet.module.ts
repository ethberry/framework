import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { WalletControllerEth } from "./wallet.controller.eth";
import { WalletServiceEth } from "./wallet.service.eth";
import { ExchangeHistoryModule } from "../mechanics/exchange/history/exchange-history.module";
import { WalletPayeesEntity } from "./wallet-payees.entity";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { PayeesService } from "./wallet-payees.service";
import { BalanceModule } from "../hierarchy/balance/balance.module";
import { TokenModule } from "../hierarchy/token/token.module";

@Module({
  imports: [
    ConfigModule,
    ExchangeHistoryModule,
    TokenModule,
    ContractModule,
    BalanceModule,
    TypeOrmModule.forFeature([WalletPayeesEntity]),
  ],
  controllers: [WalletControllerEth],
  providers: [Logger, WalletServiceEth, PayeesService],
  exports: [WalletServiceEth, PayeesService],
})
export class WalletModule {}
