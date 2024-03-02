import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { BaseUriControllerEth } from "./base-uri.controller.eth";
import { BaseUriServiceEth } from "./base-uri.service.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, ContractModule, TokenModule, EventHistoryModule],
  controllers: [BaseUriControllerEth],
  providers: [signalServiceProvider, BaseUriServiceEth],
  exports: [BaseUriServiceEth],
})
export class BaseUriModule {}
