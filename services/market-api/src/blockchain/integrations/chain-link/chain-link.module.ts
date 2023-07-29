import { Module } from "@nestjs/common";

import { ChainLinkSubscriptionModule } from "./subscription/subscription.module";

@Module({
  imports: [ChainLinkSubscriptionModule],
})
export class ChainLinkModule {}
