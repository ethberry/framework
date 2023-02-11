import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { PyramidDepositModule } from "../deposit/deposit.module";
import { PyramidRulesService } from "./rules.service";
import { PyramidRulesEntity } from "./rules.entity";
import { PyramidLogModule } from "../log/log.module";
import { PyramidRulesControllerEth } from "./rules.controller.eth";
import { PyramidRulesServiceEth } from "./rules.service.eth";
import { EventHistoryModule } from "../../../event-history/event-history.module";

@Module({
  imports: [
    AssetModule,
    ContractModule,
    PyramidLogModule,
    PyramidDepositModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([PyramidRulesEntity]),
  ],
  providers: [Logger, PyramidRulesService, PyramidRulesServiceEth],
  controllers: [PyramidRulesControllerEth],
  exports: [PyramidRulesService, PyramidRulesServiceEth],
})
export class PyramidRulesModule {}
