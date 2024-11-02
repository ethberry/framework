import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule, ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { signalServiceProvider } from "../../../common/providers";
import { UserModule } from "../../../infrastructure/user/user.module";
import { LegacyVestingModule } from "../../mechanics/marketing/legacy-vesting/legacy-vesting.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { RentableModule } from "../../mechanics/gaming/rentable/rentable.module";
import { BalanceModule } from "../../hierarchy/balance/balance.module";
import { ContractManagerControllerEth } from "./erc998.controller.eth";
import { ContractManagerErc998ServiceEth } from "./erc998.service.eth";
import { ContractManagerErc998ServiceLog } from "./erc998.service.log";

@Module({
  imports: [
    ConfigModule,
    EthersModule.deferred(),
    ContractModule,
    EventHistoryModule,
    LegacyVestingModule,
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
    ContractManagerErc998ServiceLog,
    ContractManagerErc998ServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerControllerEth],
  exports: [ContractManagerErc998ServiceLog, ContractManagerErc998ServiceEth],
})
export class ContractManagerErc998Module implements OnModuleInit {
  constructor(protected readonly contractManagerErc998ServiceLog: ContractManagerErc998ServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerErc998ServiceLog.initRegistry();
  }
}
