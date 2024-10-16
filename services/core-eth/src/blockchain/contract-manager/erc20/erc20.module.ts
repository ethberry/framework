import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule, ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { signalServiceProvider } from "../../../common/providers";
import { UserModule } from "../../../infrastructure/user/user.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { ContractManagerErc20ControllerEth } from "./erc20.controller.eth";
import { ContractManagerErc20ServiceEth } from "./erc20.service.eth";
import { AccessListModule } from "../../extensions/access-list/access-list.module";
import { AccessControlModule } from "../../extensions/access-control/access-control.module";
import { ContractManagerErc20ServiceLog } from "./erc20.service.log";

@Module({
  imports: [
    ConfigModule,
    EthersModule.deferred(),
    ContractModule,
    EventHistoryModule,
    TemplateModule,
    TokenModule,
    UserModule,
    SecretManagerModule.deferred(),
    AccessControlModule,
    AccessListModule,
  ],
  providers: [
    signalServiceProvider,
    Logger,
    ContractManagerErc20ServiceLog,
    ContractManagerErc20ServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerErc20ControllerEth],
  exports: [ContractManagerErc20ServiceLog, ContractManagerErc20ServiceEth],
})
export class ContractManagerErc20Module implements OnModuleInit {
  constructor(protected readonly contractManagerErc20ServiceLog: ContractManagerErc20ServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerErc20ServiceLog.initRegistry();
  }
}
