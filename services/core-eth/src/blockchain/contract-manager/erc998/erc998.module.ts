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
import { ContractManagerControllerEth } from "./erc998.controller.eth";
import { ContractManagerServiceEth } from "./erc998.service.eth";
import { ContractManagerServiceLog } from "./erc998.service.log";
import { Erc998TokenModule } from "../../tokens/erc998/token/token.module";

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
    Erc998TokenModule,
  ],
  providers: [
    signalServiceProvider,
    Logger,
    ContractManagerServiceLog,
    ContractManagerServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerControllerEth],
  exports: [ContractManagerServiceLog, ContractManagerServiceEth],
})
export class ContractManagerErc998Module implements OnModuleInit {
  constructor(protected readonly contractManagerServiceLog: ContractManagerServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerServiceLog.updateRegistry();
  }
}
