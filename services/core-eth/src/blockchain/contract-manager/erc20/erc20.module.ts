import { Logger, Module } from "@nestjs/common";
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
import { Erc20TokenModule } from "../../tokens/erc20/token/token.module";
import { AccessListModule } from "../../extensions/access-list/access-list.module";
import { AccessControlModule } from "../../extensions/access-control/access-control.module";

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
    Erc20TokenModule,
    AccessControlModule,
    AccessListModule,
  ],
  providers: [signalServiceProvider, Logger, ContractManagerErc20ServiceEth, ethersSignerProvider, ethersRpcProvider],
  controllers: [ContractManagerErc20ControllerEth],
  exports: [ContractManagerErc20ServiceEth],
})
export class ContractManagerErc20Module {}
