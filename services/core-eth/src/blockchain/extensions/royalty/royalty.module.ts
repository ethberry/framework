import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { RoyaltyControllerEth } from "./royalty.controller.eth";
import { RoyaltyServiceEth } from "./royalty.service.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { signalServiceProvider } from "../../../common/providers";
import { RoyaltyServiceLog } from "./royalty.service.log";

@Module({
  imports: [ConfigModule, ContractModule, EventHistoryModule, EthersModule.deferred()],
  controllers: [RoyaltyControllerEth],
  providers: [signalServiceProvider, RoyaltyServiceLog, RoyaltyServiceEth],
  exports: [RoyaltyServiceLog, RoyaltyServiceEth],
})
export class RoyaltyModule {}
