import { Logger, Module } from "@nestjs/common";

import { RoyaltyControllerEth } from "./royalty.controller.eth";
import { RoyaltyServiceEth } from "./royalty.service.eth";
import { ContractHistoryModule } from "../contract-history/contract-history.module";
import { ContractManagerModule } from "../contract-manager/contract-manager.module";
import { ContractModule } from "../hierarchy/contract/contract.module";

@Module({
  imports: [ContractHistoryModule, ContractManagerModule, ContractModule],
  controllers: [RoyaltyControllerEth],
  providers: [Logger, RoyaltyServiceEth],
  exports: [RoyaltyServiceEth],
})
export class RoyaltyModule {}
