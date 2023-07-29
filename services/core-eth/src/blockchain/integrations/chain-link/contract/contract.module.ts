import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@gemunion/nest-js-module-secret-manager-gcp";

import { emlServiceProvider } from "../../../../common/providers";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ChainLinkContractControllerEth } from "./contract.controller.eth";
import { ChainLinkContractServiceEth } from "./contract.service.eth";
import { ChainLinkLogModule } from "./log/log.module";
import { ChainLinkContractServiceCron } from "./contract.service.cron";
import { MerchantModule } from "../../../../infrastructure/merchant/merchant.module";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    ChainLinkLogModule,
    EventHistoryModule,
    MerchantModule,
    SecretManagerModule.deferred(),
  ],
  providers: [
    Logger,
    ethersRpcProvider,
    ethersSignerProvider,
    emlServiceProvider,
    ChainLinkContractServiceEth,
    ChainLinkContractServiceCron,
  ],
  controllers: [ChainLinkContractControllerEth],
  exports: [ChainLinkContractServiceEth],
})
export class ChainLinkContractModule {}
