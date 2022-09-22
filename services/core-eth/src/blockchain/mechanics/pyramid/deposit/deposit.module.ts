import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PyramidDepositService } from "./deposit.service";
import { PyramidDepositEntity } from "./deposit.entity";
import { PyramidDepositControllerEth } from "./deposit.controller.eth";
import { PyramidDepositServiceEth } from "./deposit.service.eth";
import { PyramidRulesModule } from "../rules/rules.module";
import { PyramidHistoryModule } from "../history/history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [
    ContractModule,
    PyramidHistoryModule,
    forwardRef(() => PyramidRulesModule),
    TypeOrmModule.forFeature([PyramidDepositEntity]),
  ],
  controllers: [PyramidDepositControllerEth],
  providers: [Logger, PyramidDepositService, PyramidDepositServiceEth],
  exports: [PyramidDepositService, PyramidDepositServiceEth],
})
export class PyramidDepositModule {}
