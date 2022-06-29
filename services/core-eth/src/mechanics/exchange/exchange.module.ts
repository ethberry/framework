import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ExchangeService } from "./exchange.service";
import { ExchangeEntity } from "./exchange.entity";
import { ExchangeServiceEth } from "./exchange.service.eth";
import { Erc1155ControllerEth } from "./exchange.controller.eth";
import { ContractManagerModule } from "../../blockchain/contract-manager/contract-manager.module";
import { ExchangeLogModule } from "./exchange-log/exchange-log.module";
import { ExchangeHistoryModule } from "./exchange-history/exchange-history.module";

@Module({
  imports: [
    ContractManagerModule,
    ExchangeHistoryModule,
    ExchangeLogModule,
    TypeOrmModule.forFeature([ExchangeEntity]),
  ],
  providers: [Logger, ExchangeService, ExchangeServiceEth],
  controllers: [Erc1155ControllerEth],
  exports: [ExchangeService, ExchangeServiceEth],
})
export class ExchangeModule {}
