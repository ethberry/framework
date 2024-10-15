import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../common/providers";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { BaseUriControllerEth } from "./base-uri.controller.eth";
import { BaseUriServiceEth } from "./base-uri.service.eth";
import { BaseUriServiceLog } from "./base-uri.service.log";

@Module({
  imports: [ConfigModule, ContractModule, TokenModule, EventHistoryModule, EthersModule.deferred()],
  controllers: [BaseUriControllerEth],
  providers: [signalServiceProvider, BaseUriServiceLog, BaseUriServiceEth],
  exports: [BaseUriServiceLog, BaseUriServiceEth],
})
export class BaseUriModule implements OnModuleInit {
  constructor(private readonly baseUriServiceLog: BaseUriServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.baseUriServiceLog.initRegistry();
  }
}
