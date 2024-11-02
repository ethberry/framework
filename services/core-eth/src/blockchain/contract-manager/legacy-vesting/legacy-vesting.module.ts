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
import { ContractManagerLegacyVestingControllerEth } from "./legacy-vesting.controller.eth";
import { ContractManagerLegacyVestingServiceEth } from "./legacy-vesting.service.eth";
import { ContractManagerLegacyVestingServiceLog } from "./legacy-vesting.service.log";

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
    ContractManagerLegacyVestingServiceLog,
    ContractManagerLegacyVestingServiceEth,
    ethersSignerProvider,
    ethersRpcProvider,
  ],
  controllers: [ContractManagerLegacyVestingControllerEth],
  exports: [ContractManagerLegacyVestingServiceLog, ContractManagerLegacyVestingServiceEth],
})
export class ContractManagerLegacyVestingModule implements OnModuleInit {
  constructor(protected readonly contractManagerLegacyVestingServiceLog: ContractManagerLegacyVestingServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.contractManagerLegacyVestingServiceLog.initRegistry();
  }
}
