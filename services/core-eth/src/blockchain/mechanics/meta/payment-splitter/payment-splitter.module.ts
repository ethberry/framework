import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { PaymentSplitterServiceLog } from "./payment-splitter.service.log";

@Module({
  imports: [ConfigModule, ContractModule, EthersModule.deferred()],
  providers: [PaymentSplitterServiceLog],
  controllers: [],
  exports: [PaymentSplitterServiceLog],
})
export class PaymentSplitterModule implements OnModuleInit {
  constructor(private readonly paymentSplitterServiceLog: PaymentSplitterServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.paymentSplitterServiceLog.updateRegistry();
  }
}
