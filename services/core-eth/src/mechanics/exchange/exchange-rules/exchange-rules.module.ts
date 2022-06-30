import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ExchangeRulesService } from "./exchange-rules.service";
import { ExchangeRulesEntity } from "./exchange-rules.entity";
import { ExchangeRulesServiceEth } from "./exchange-rules.service.eth";
import { ExchangeRulesControllerEth } from "./exchange-rules.controller.eth";
import { ContractManagerModule } from "../../../blockchain/contract-manager/contract-manager.module";
import { ExchangeLogModule } from "../exchange-log/exchange-log.module";
import { ExchangeHistoryModule } from "../exchange-history/exchange-history.module";

@Module({
  imports: [
    ContractManagerModule,
    ExchangeHistoryModule,
    ExchangeLogModule,
    TypeOrmModule.forFeature([ExchangeRulesEntity]),
  ],
  providers: [Logger, ExchangeRulesService, ExchangeRulesServiceEth],
  controllers: [ExchangeRulesControllerEth],
  exports: [ExchangeRulesService, ExchangeRulesServiceEth],
})
export class ExchangeRulesModule {}
