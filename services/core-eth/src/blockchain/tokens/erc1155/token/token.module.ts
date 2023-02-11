import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider } from "@gemunion/nestjs-ethers";

import { Erc1155TokenControllerEth } from "./token.controller.eth";
import { Erc1155TokenServiceEth } from "./token.service.eth";
import { Erc1155TokenLogModule } from "./log/log.module";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";

@Module({
  imports: [
    ConfigModule,
    EventHistoryModule,
    Erc1155TokenLogModule,
    Erc1155TokenModule,
    ContractModule,
    TokenModule,
    TemplateModule,
    ContractModule,
    BalanceModule,
    TypeOrmModule.forFeature([TemplateEntity]),
  ],
  providers: [Logger, ethersRpcProvider, Erc1155TokenServiceEth],
  controllers: [Erc1155TokenControllerEth],
  exports: [Erc1155TokenServiceEth],
})
export class Erc1155TokenModule {}
