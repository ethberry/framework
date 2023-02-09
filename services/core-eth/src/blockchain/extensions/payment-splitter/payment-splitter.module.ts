import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PaymentSplitterControllerEth } from "./payment-splitter.controller.eth";
import { PaymentSplitterServiceEth } from "./payment-splitter.service.eth";
import { ExchangeHistoryModule } from "../../exchange/history/history.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { BalanceModule } from "../../hierarchy/balance/balance.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { PayeeModule } from "./payee/payee.module";

@Module({
  imports: [ConfigModule, ExchangeHistoryModule, ContractModule, TokenModule, BalanceModule, PayeeModule],
  controllers: [PaymentSplitterControllerEth],
  providers: [Logger, PaymentSplitterServiceEth],
  exports: [PaymentSplitterServiceEth],
})
export class PaymentSplitterModule {}
