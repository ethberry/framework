import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../common/providers";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { RoyaltyServiceEth } from "./royalty.service.eth";
import { RoyaltyControllerEth } from "./royalty.controller.eth";
import { RoyaltyServiceLog } from "./royalty.service.log";

@Module({
  imports: [ConfigModule, ContractModule, TokenModule, EventHistoryModule, EthersModule.deferred()],
  controllers: [RoyaltyControllerEth],
  providers: [signalServiceProvider, RoyaltyServiceLog, RoyaltyServiceEth],
  exports: [RoyaltyServiceLog, RoyaltyServiceEth],
})
export class RoyaltyModule implements OnModuleInit {
  constructor(private readonly royaltyServiceLog: RoyaltyServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.royaltyServiceLog.initRegistry();
  }
}
