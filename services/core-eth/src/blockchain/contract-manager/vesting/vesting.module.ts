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
import { ContractManagerVestingControllerEth } from "./vesting.controller.eth";
import { ContractManagerVestingServiceEth } from "./vesting.service.eth";
import { ContractManagerVestingServiceLog } from "./vesting.service.log";

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
    ContractManagerVestingServiceLog,
    ContractManagerVestingServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerVestingControllerEth],
  exports: [ContractManagerVestingServiceLog, ContractManagerVestingServiceEth],
})
export class ContractManagerVestingModule implements OnModuleInit {
  constructor(protected readonly contractManagerVestingServiceLog: ContractManagerVestingServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerVestingServiceLog.initRegistry();
  }
}
