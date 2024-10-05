import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { MerchantModule } from "../../../../infrastructure/merchant/merchant.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ChainLinkSubscriptionEntity } from "./subscription.entity";
import { ChainLinkSubscriptionService } from "./subscription.service";
import { ChainLinkSubscriptionControllerEth } from "./subscription.controller.eth";
import { ChainLinkSubscriptionServiceEth } from "./subscription.service.eth";
import { ChainLinkSubscriptionServiceLog } from "./subsription.service.log";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    MerchantModule,
    EventHistoryModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([ChainLinkSubscriptionEntity]),
  ],
  controllers: [ChainLinkSubscriptionControllerEth],
  providers: [
    Logger,
    signalServiceProvider,
    ChainLinkSubscriptionService,
    ChainLinkSubscriptionServiceLog,
    ChainLinkSubscriptionServiceEth,
  ],
  exports: [ChainLinkSubscriptionService, ChainLinkSubscriptionServiceLog, ChainLinkSubscriptionServiceEth],
})
export class ChainLinkSubscriptionModule implements OnModuleInit {
  constructor(protected readonly chainLinkSubscriptionServiceLog: ChainLinkSubscriptionServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.chainLinkSubscriptionServiceLog.updateRegistry();
  }
}
