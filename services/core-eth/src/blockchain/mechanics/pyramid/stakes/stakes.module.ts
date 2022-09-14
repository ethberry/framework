import { Module, Logger, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PyramidStakesService } from "./stakes.service";
import { PyramidStakesEntity } from "./stakes.entity";
import { PyramidStakesControllerEth } from "./stakes.controller.eth";
import { PyramidStakesServiceEth } from "./stakes.service.eth";
import { PyramidRulesModule } from "../rules/rules.module";
import { PyramidHistoryModule } from "../history/history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [
    ContractModule,
    PyramidHistoryModule,
    forwardRef(() => PyramidRulesModule),
    TypeOrmModule.forFeature([PyramidStakesEntity]),
  ],
  controllers: [PyramidStakesControllerEth],
  providers: [Logger, PyramidStakesService, PyramidStakesServiceEth],
  exports: [PyramidStakesService, PyramidStakesServiceEth],
})
export class PyramidStakesModule {}
