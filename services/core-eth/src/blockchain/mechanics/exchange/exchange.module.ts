import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ExchangeService } from "./exchange.service";
import { ExchangeEntity } from "./exchange.entity";
import { ExchangeServiceEth } from "./exchange.service.eth";
import { ExchangeControllerEth } from "./exchange.controller.eth";
import { ExchangeLogModule } from "./log/exchange-log.module";
import { ExchangeHistoryModule } from "./history/exchange-history.module";
import { ClaimModule } from "../claim/claim.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [
    ContractModule,
    ExchangeHistoryModule,
    ExchangeLogModule,
    ClaimModule,
    TypeOrmModule.forFeature([ExchangeEntity]),
  ],
  providers: [Logger, ExchangeService, ExchangeServiceEth],
  controllers: [ExchangeControllerEth],
  exports: [ExchangeService, ExchangeServiceEth],
})
export class ExchangeModule {}
