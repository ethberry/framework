import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { RoyaltyControllerEth } from "./royalty.controller.eth";
import { RoyaltyServiceEth } from "./royalty.service.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, ContractModule, EventHistoryModule],
  controllers: [RoyaltyControllerEth],
  providers: [signalServiceProvider, RoyaltyServiceEth],
  exports: [RoyaltyServiceEth],
})
export class RoyaltyModule {}
