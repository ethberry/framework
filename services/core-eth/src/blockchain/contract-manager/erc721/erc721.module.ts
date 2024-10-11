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
import { ContractManagerErc721ControllerEth } from "./erc721.controller.eth";
import { ContractManagerErc721ServiceEth } from "./erc721.service.eth";
import { Erc721TokenModule } from "../../tokens/erc721/token/token.module";
import { ContractManagerServiceLog } from "./erc721.service.log";
import { AccessControlModule } from "../../extensions/access-control/access-control.module";
import { AccessListModule } from "../../extensions/access-list/access-list.module";
import { DiscreteModule } from "../../mechanics/gaming/discrete/discrete.module";
import { PauseModule } from "../../extensions/pause/pause.module";

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
    Erc721TokenModule,
    AccessControlModule,
    AccessListModule,
    PauseModule,
    DiscreteModule,
  ],
  providers: [
    signalServiceProvider,
    Logger,
    ContractManagerServiceLog,
    ContractManagerErc721ServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerErc721ControllerEth],
  exports: [ContractManagerServiceLog, ContractManagerErc721ServiceEth],
})
export class ContractManagerErc721Module implements OnModuleInit {
  constructor(protected readonly contractManagerServiceLog: ContractManagerServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerServiceLog.updateRegistry();
  }
}
