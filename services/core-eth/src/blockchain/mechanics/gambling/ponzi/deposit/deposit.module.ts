import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PonziDepositService } from "./deposit.service";
import { PonziDepositEntity } from "./deposit.entity";
import { PonziDepositControllerEth } from "./deposit.controller.eth";
import { PonziDepositServiceEth } from "./deposit.service.eth";
import { PonziRulesModule } from "../rules/rules.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { BalanceModule } from "../../../../hierarchy/balance/balance.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { signalServiceProvider } from "../../../../../common/providers";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    TokenModule,
    BalanceModule,
    EventHistoryModule,
    forwardRef(() => PonziRulesModule),
    TypeOrmModule.forFeature([PonziDepositEntity]),
  ],
  controllers: [PonziDepositControllerEth],
  providers: [Logger, signalServiceProvider, PonziDepositService, PonziDepositServiceEth],
  exports: [PonziDepositService, PonziDepositServiceEth],
})
export class PonziDepositModule {}
