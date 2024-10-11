import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { PaymentSplitterServiceLog } from "./payment-splitter.service.log";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { PayeeModule } from "./payee/payee.module";
import { PaymentSplitterControllerEth } from "./payment-splitter.controller.eth";
import { PaymentSplitterServiceEth } from "./payment-splitter.service.eth";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EventHistoryModule,
    TokenModule,
    BalanceModule,
    PayeeModule,
    EthersModule.deferred(),
  ],
  providers: [PaymentSplitterServiceLog, PaymentSplitterServiceEth],
  controllers: [PaymentSplitterControllerEth],
  exports: [PaymentSplitterServiceLog, PaymentSplitterServiceEth],
})
export class PaymentSplitterModule implements OnModuleInit {
  constructor(private readonly paymentSplitterServiceLog: PaymentSplitterServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.paymentSplitterServiceLog.updateRegistry();
  }
}
