import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider } from "@gemunion/nest-js-module-ethers-gcp";

import { WrapperServiceEth } from "./wrapper.service.eth";
import { WrapperControllerEth } from "./wrapper.controller.eth";
import { WrapperLogModule } from "./log/log.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { signalServiceProvider } from "../../../../common/providers";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    TokenModule,
    TemplateModule,
    BalanceModule,
    AssetModule,
    EventHistoryModule,
    WrapperLogModule,
  ],
  providers: [Logger, signalServiceProvider, ethersRpcProvider, WrapperServiceEth],
  controllers: [WrapperControllerEth],
  exports: [WrapperServiceEth],
})
export class WrapperModule {}
