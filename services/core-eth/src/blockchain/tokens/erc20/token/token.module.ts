import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20TokenControllerEth } from "./token.controller.eth";
import { Erc20TokenServiceEth } from "./token.service.eth";
import { ContractHistoryModule } from "../../../contract-history/contract-history.module";
import { Erc20TokenLogModule } from "./token-log/token-log.module";
import { AccessControlModule } from "../../../access-control/access-control.module";
import { AccessListModule } from "../../../access-list/access-list.module";
import { AccessListServiceEth } from "../../../access-list/access-list.service.eth";
import { AccessListHistoryModule } from "../../../access-list/history/history.module";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [
    TokenModule,
    BalanceModule,
    ContractModule,
    ContractHistoryModule,
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
