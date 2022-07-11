import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20TokenControllerEth } from "./token.controller.eth";
import { Erc20TokenServiceEth } from "./token.service.eth";
import { Erc20ContractHistoryModule } from "./contract-history/contract-history.module";
import { Erc20TokenLogModule } from "./token-log/token-log.module";
import { AccessControlModule } from "../../blockchain/access-control/access-control.module";
import { AccessListModule } from "../../blockchain/access-list/access-list.module";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { AccessListServiceEth } from "../../blockchain/access-list/access-list.service.eth";
import { AccessListHistoryModule } from "../../blockchain/access-list/access-list-history/access-list-history.module";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";
import { BalanceModule } from "../../blockchain/hierarchy/balance/balance.module";
import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";

@Module({
  imports: [
    TokenModule,
    ContractManagerModule,
    BalanceModule,
    ContractModule,
    Erc20ContractHistoryModule,
    Erc20TokenLogModule,
    AccessControlModule,
    AccessListModule,
    AccessListHistoryModule,
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Logger, Erc20TokenServiceEth, AccessListServiceEth],
  controllers: [Erc20TokenControllerEth],
  exports: [Erc20TokenServiceEth],
})
export class Erc20TokenModule {}
