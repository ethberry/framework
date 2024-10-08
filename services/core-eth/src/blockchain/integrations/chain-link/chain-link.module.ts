import { Module } from "@nestjs/common";

import { ChainLinkCoordinatorModule } from "./coordinator/coordinator.module";
import { ChainLinkSubscriptionModule } from "./subscription/subscription.module";
import { ChainLinkConsumerModule } from "./consumer/consumer.module";

@Module({
  imports: [ChainLinkCoordinatorModule, ChainLinkSubscriptionModule, ChainLinkConsumerModule],
})
export class ChainLinkModule {}
