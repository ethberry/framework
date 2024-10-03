import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule, ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { emlServiceProvider } from "../../../../common/providers";
import { MerchantModule } from "../../../../infrastructure/merchant/merchant.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ChainLinkSubscriptionModule } from "../subscription/subscription.module";
import { ChainLinkContractControllerEth } from "./contract.controller.eth";
import { ChainLinkContractServiceEth } from "./contract.service.eth";
import { ChainLinkContractServiceCron } from "./contract.service.cron";
import { ChainLinkContractServiceLog } from "./contract.service.log";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    EventHistoryModule,
    MerchantModule,
    ChainLinkSubscriptionModule,
    EthersModule.deferred(),
    SecretManagerModule.deferred(),
  ],
  providers: [
    Logger,
    ethersRpcProvider,
    ethersSignerProvider,
    emlServiceProvider,
    ChainLinkContractServiceLog,
    ChainLinkContractServiceEth,
    ChainLinkContractServiceCron,
  ],
  controllers: [ChainLinkContractControllerEth],
  exports: [ChainLinkContractServiceLog, ChainLinkContractServiceEth],
})
export class ChainLinkContractModule {}
