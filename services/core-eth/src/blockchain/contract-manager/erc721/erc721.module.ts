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
import { ContractManagerErc721ControllerEth } from "./erc721.controller.eth";
import { ContractManagerErc721ServiceEth } from "./erc721.service.eth";
import { ContractManagerErc721ServiceLog } from "./erc721.service.log";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EventHistoryModule,
    TemplateModule,
    TokenModule,
    UserModule,
    EthersModule.deferred(),
    SecretManagerModule.deferred(),
  ],
  providers: [
    signalServiceProvider,
    Logger,
    ContractManagerErc721ServiceLog,
    ContractManagerErc721ServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerErc721ControllerEth],
  exports: [ContractManagerErc721ServiceLog, ContractManagerErc721ServiceEth],
})
export class ContractManagerErc721Module implements OnModuleInit {
  constructor(protected readonly contractManagerErc721ServiceLog: ContractManagerErc721ServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerErc721ServiceLog.initRegistry();
  }
}