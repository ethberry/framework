import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { Erc20TokenControllerEth } from "./token.controller.eth";
import { Erc20TokenServiceEth } from "./token.service.eth";
import { Erc20TokenLogModule } from "./log/log.module";

@Module({
  imports: [
    TokenModule,
    BalanceModule,
    EventHistoryModule,
    Erc20TokenLogModule,
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Erc20TokenServiceEth],
  controllers: [Erc20TokenControllerEth],
  exports: [Erc20TokenServiceEth],
})
export class Erc20TokenModule {}
