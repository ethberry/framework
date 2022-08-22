import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ethersRpcProvider } from "@gemunion/nestjs-ethers";

import { ContractHistoryModule } from "../../../contract-history/contract-history.module";

import { Erc721TokenControllerEth } from "./token.controller.eth";
import { Erc721TokenServiceEth } from "./token.service.eth";
import { Erc721TokenLogModule } from "./token-log/token-log.module";
import { AccessControlModule } from "../../../access-control/access-control.module";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";

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
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Logger, ethersRpcProvider, Erc721TokenServiceEth],
  controllers: [Erc721TokenControllerEth],
  exports: [Erc721TokenServiceEth],
})
export class Erc721TokenModule {}
