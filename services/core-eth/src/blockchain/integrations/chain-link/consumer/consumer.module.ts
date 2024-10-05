import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { signalServiceProvider } from "../../../../common/providers";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { ChainLinkConsumerControllerEth } from "./consumer.controller.eth";
import { ChainLinkConsumerServiceEth } from "./consumer.service.eth";

@Module({
  imports: [ConfigModule, ContractModule, EventHistoryModule],
  controllers: [ChainLinkConsumerControllerEth],
  providers: [signalServiceProvider, ChainLinkConsumerServiceEth],
  exports: [ChainLinkConsumerServiceEth],
})
export class ChainLinkConsumerModule {}
