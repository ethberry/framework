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
import { ContractManagerWaitListControllerEth } from "./wait-list.controller.eth";
import { ContractManagerWaitListServiceEth } from "./wait-list.service.eth";
import { ContractManagerWaitListServiceLog } from "./wait-list.service.log";

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
    ContractManagerWaitListServiceLog,
    ContractManagerWaitListServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerWaitListControllerEth],
  exports: [ContractManagerWaitListServiceLog, ContractManagerWaitListServiceEth],
})
export class ContractManagerWaitListModule implements OnModuleInit {
  constructor(protected readonly contractManagerWaitListServiceLog: ContractManagerWaitListServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerWaitListServiceLog.initRegistry();
  }
}
