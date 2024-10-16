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
import { ContractManagerErc1155ControllerEth } from "./erc1155.controller.eth";
import { ContractManagerErc1155ServiceEth } from "./erc1155.service.eth";
import { ContractManagerErc1155ServiceLog } from "./erc1155.service.log";

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
    ContractManagerErc1155ServiceLog,
    ContractManagerErc1155ServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerErc1155ControllerEth],
  exports: [ContractManagerErc1155ServiceLog, ContractManagerErc1155ServiceEth],
})
export class ContractManagerErc1155Module implements OnModuleInit {
  constructor(protected readonly contractManagerErc1155ServiceLog: ContractManagerErc1155ServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerErc1155ServiceLog.initRegistry();
  }
}
