import { Module } from "@nestjs/common";

import { ChainLinkContractModule } from "./contract/contract.module";
import { ChainLinkSubscriptionModule } from "./subscription/subscription.module";

@Module({
  imports: [ChainLinkContractModule, ChainLinkSubscriptionModule],
})
export class ChainLinkModule {}
