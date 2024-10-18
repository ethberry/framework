import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule, ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { signalServiceProvider } from "../../../common/providers";
import { UserModule } from "../../../infrastructure/user/user.module";
import { VestingModule } from "../../mechanics/marketing/vesting/vesting.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { RentableModule } from "../../mechanics/gaming/rentable/rentable.module";
import { BalanceModule } from "../../hierarchy/balance/balance.module";
import { ContractManagerPaymentSplitterControllerEth } from "./payment-splitter.controller.eth";
import { ContractManagerPaymentSplitterServiceEth } from "./payment-splitter.service.eth";
import { ContractManagerPaymentSplitterServiceLog } from "./payment-splitter.service.log";

@Module({
  imports: [
    ConfigModule,
    EthersModule.deferred(),
    ContractModule,
    EventHistoryModule,
    VestingModule,
    TemplateModule,
    TokenModule,
    RentableModule,
    BalanceModule,
    UserModule,
    SecretManagerModule.deferred(),
  ],
  providers: [
    signalServiceProvider,
    Logger,
    ContractManagerPaymentSplitterServiceLog,
    ContractManagerPaymentSplitterServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerPaymentSplitterControllerEth],
  exports: [ContractManagerPaymentSplitterServiceLog, ContractManagerPaymentSplitterServiceEth],
})
export class ContractManagerPaymentSplitterModule implements OnModuleInit {
  constructor(protected readonly contractManagerPaymentSplitterServiceLog: ContractManagerPaymentSplitterServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerPaymentSplitterServiceLog.initRegistry();
  }
}
