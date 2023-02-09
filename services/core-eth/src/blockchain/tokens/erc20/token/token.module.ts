import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20TokenControllerEth } from "./token.controller.eth";
import { Erc20TokenServiceEth } from "./token.service.eth";
import { ContractHistoryModule } from "../../../hierarchy/contract/history/history.module";
import { Erc20TokenLogModule } from "./log/log.module";
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
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Logger, Erc20TokenServiceEth],
  controllers: [Erc20TokenControllerEth],
  exports: [Erc20TokenServiceEth],
})
export class Erc20TokenModule {}
