import { Module } from "@nestjs/common";

import { RoyaltyControllerEth } from "./royalty.controller.eth";
import { RoyaltyServiceEth } from "./royalty.service.eth";
import { ContractHistoryModule } from "../../hierarchy/contract/history/history.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, ContractHistoryModule],
  controllers: [RoyaltyControllerEth],
  providers: [RoyaltyServiceEth],
  exports: [RoyaltyServiceEth],
})
export class RoyaltyModule {}
