import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule, ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { emlServiceProvider } from "../../../../common/providers";
import { MerchantModule } from "../../../../infrastructure/merchant/merchant.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ChainLinkCoordinatorControllerEth } from "./coordinator.controller.eth";
import { ChainLinkCoordinatorServiceEth } from "./coordinator.service.eth";
import { ChainLinkCoordinatorServiceCron } from "./coordinator.service.cron";
import { ChainLinkCoordinatorServiceLog } from "./coordinator.service.log";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EventHistoryModule,
    MerchantModule,
    EthersModule.deferred(),
    SecretManagerModule.deferred(),
  ],
  providers: [
    Logger,
    ethersRpcProvider,
    ethersSignerProvider,
    emlServiceProvider,
    ChainLinkCoordinatorServiceLog,
    ChainLinkCoordinatorServiceEth,
    ChainLinkCoordinatorServiceCron,
  ],
  controllers: [ChainLinkCoordinatorControllerEth],
  exports: [ChainLinkCoordinatorServiceLog, ChainLinkCoordinatorServiceEth],
})
export class ChainLinkCoordinatorModule implements OnModuleInit {
  constructor(protected readonly chainLinkCoordinatorServiceLog: ChainLinkCoordinatorServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.chainLinkCoordinatorServiceLog.updateRegistry();
  }
}
