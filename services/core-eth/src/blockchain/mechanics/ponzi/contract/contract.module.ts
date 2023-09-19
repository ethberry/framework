import { Logger, Module } from "@nestjs/common";

import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { PonziDepositControllerEth } from "./contract.controller.eth";
import { PonziContractServiceEth } from "./contract.service.eth";

@Module({
  imports: [TokenModule, BalanceModule, EventHistoryModule],
  controllers: [PonziDepositControllerEth],
  providers: [Logger, PonziContractServiceEth],
  exports: [PonziContractServiceEth],
})
export class PonziContractModule {}
