import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TokenHistoryModule } from "./token-history/token-history.module";

import { Erc721TokenControllerEth } from "./token.controller.eth";
import { Erc721TokenServiceEth } from "./token.service.eth";
import { Erc721TokenLogModule } from "./token-log/token-log.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";
import { BalanceModule } from "../../blockchain/hierarchy/balance/balance.module";

@Module({
  imports: [
    ConfigModule,
    ContractManagerModule,
    Erc721TokenHistoryModule,
    Erc721TokenLogModule,
    TemplateModule,
    BalanceModule,
    AccessControlModule,
    ContractModule,
    TokenModule,
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Logger, Erc721TokenServiceEth],
  controllers: [Erc721TokenControllerEth],
  exports: [Erc721TokenServiceEth],
})
export class Erc721TokenModule {}
