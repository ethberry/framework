import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { signalServiceProvider } from "../../../../common/providers";
import { WrapperServiceLog } from "./wrapper.service.log";
import { WrapperServiceEth } from "./wrapper.service.eth";
import { WrapperControllerEth } from "./wrapper.controller.eth";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    TokenModule,
    TemplateModule,
    BalanceModule,
    AssetModule,
    EventHistoryModule,
    EthersModule.deferred(),
  ],
  providers: [Logger, signalServiceProvider, ethersRpcProvider, WrapperServiceLog, WrapperServiceEth],
  controllers: [WrapperControllerEth],
  exports: [WrapperServiceLog, WrapperServiceEth],
})
export class WrapperModule {}
