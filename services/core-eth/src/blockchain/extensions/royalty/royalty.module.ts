import { Module } from "@nestjs/common";

import { RoyaltyControllerEth } from "./royalty.controller.eth";
import { RoyaltyServiceEth } from "./royalty.service.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [ContractModule, EventHistoryModule],
  controllers: [RoyaltyControllerEth],
  providers: [RoyaltyServiceEth],
  exports: [RoyaltyServiceEth],
})
export class RoyaltyModule {}
