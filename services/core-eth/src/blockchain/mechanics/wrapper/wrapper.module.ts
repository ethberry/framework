import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider } from "@gemunion/nestjs-ethers";

import { WrapperServiceEth } from "./wrapper.service.eth";
import { WrapperControllerEth } from "./wrapper.controller.eth";
import { WrapperLogModule } from "./log/log.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { ContractHistoryModule } from "../../contract-history/contract-history.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { BalanceModule } from "../../hierarchy/balance/balance.module";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    TokenModule,
    TemplateModule,
    BalanceModule,
    AssetModule,
    ContractHistoryModule,
    WrapperLogModule,
  ],
  providers: [Logger, ethersRpcProvider, WrapperServiceEth],
  controllers: [WrapperControllerEth],
  exports: [WrapperServiceEth],
})
export class WrapperModule {}
