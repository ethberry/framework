import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ContractHistoryModule } from "../../../contract-history/contract-history.module";

import { Erc721TokenControllerEth } from "./token.controller.eth";
import { Erc721TokenServiceEth } from "./token.service.eth";
import { Erc721TokenLogModule } from "./log/log.module";
import { AccessControlModule } from "../../../access-control/access-control.module";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { AssetModule } from "../../../mechanics/asset/asset.module";
import { BreedModule } from "../../../mechanics/breed/breed.module";

@Module({
  imports: [
    ConfigModule,
    ContractHistoryModule,
    Erc721TokenLogModule,
    AccessControlModule,
    TemplateModule,
    BalanceModule,
    ContractModule,
    TokenModule,
    AssetModule,
    forwardRef(() => BreedModule),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Logger, ethersRpcProvider, ethersSignerProvider, Erc721TokenServiceEth],
  controllers: [Erc721TokenControllerEth],
  exports: [Erc721TokenServiceEth],
})
export class Erc721TokenModule {}
