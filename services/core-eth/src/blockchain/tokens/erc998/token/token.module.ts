import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ContractHistoryModule } from "../../../hierarchy/contract/history/history.module";

import { Erc998TokenControllerEth } from "./token.controller.eth";
import { Erc998TokenServiceEth } from "./token.service.eth";
import { Erc998TokenLogModule } from "./log/log.module";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { OwnershipModule } from "../ownership/ownership.module";
import { Erc998CompositionModule } from "../composition/composition.module";
import { AssetModule } from "../../../exchange/asset/asset.module";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    ContractHistoryModule,
    Erc998TokenLogModule,
    TemplateModule,
    TokenModule,
    BalanceModule,
    ContractModule,
    OwnershipModule,
    Erc998CompositionModule,
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, Erc998TokenServiceEth],
  controllers: [Erc998TokenControllerEth],
  exports: [Erc998TokenServiceEth],
})
export class Erc998TokenModule {}
