import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MerchantModule } from "../../../../infrastructure/merchant/merchant.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";

import { ChainLinkSubscriptionEntity } from "./subscription.entity";
import { ChainLinkSubscriptionService } from "./subscription.service";
import { ChainLinkSubscriptionLogModule } from "./log/log.module";
import { ChainLinkSubscriptionControllerEth } from "./subscription.controller.eth";
import { ChainLinkSubscriptionServiceEth } from "./subscription.service.eth";

@Module({
  imports: [
    ConfigModule,
    MerchantModule,
    EventHistoryModule,
    ChainLinkSubscriptionLogModule,
    TypeOrmModule.forFeature([ChainLinkSubscriptionEntity]),
  ],
  controllers: [ChainLinkSubscriptionControllerEth],
  providers: [Logger, ChainLinkSubscriptionService, ChainLinkSubscriptionServiceEth],
  exports: [ChainLinkSubscriptionService, ChainLinkSubscriptionServiceEth],
})
export class ChainLinkSubscriptionModule {}
