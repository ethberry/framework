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
import { ContractManagerLootControllerEth } from "./loot.controller.eth";
import { ContractManagerLootServiceEth } from "./loot.service.eth";
import { ContractManagerLootServiceLog } from "./loot.service.log";

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
    ContractManagerLootServiceLog,
    ContractManagerLootServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerLootControllerEth],
  exports: [ContractManagerLootServiceLog, ContractManagerLootServiceEth],
})
export class ContractManagerLootModule implements OnModuleInit {
  constructor(protected readonly contractManagerLootServiceLog: ContractManagerLootServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerLootServiceLog.initRegistry();
  }
}
