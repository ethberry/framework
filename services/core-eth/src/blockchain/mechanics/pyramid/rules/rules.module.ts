import { Module, Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../asset/asset.module";
import { PyramidStakesModule } from "../stakes/stakes.module";
import { PyramidRulesService } from "./rules.service";
import { PyramidRulesEntity } from "./rules.entity";
import { PyramidLogModule } from "../log/log.module";
import { PyramidRulesControllerEth } from "./rules.controller.eth";
import { PyramidRulesServiceEth } from "./rules.service.eth";
import { PyramidHistoryModule } from "../history/history.module";

@Module({
  imports: [
    AssetModule,
    ContractModule,
    PyramidLogModule,
    PyramidStakesModule,
    PyramidHistoryModule,
    TypeOrmModule.forFeature([PyramidRulesEntity]),
  ],
  providers: [Logger, PyramidRulesService, PyramidRulesServiceEth],
  controllers: [PyramidRulesControllerEth],
  exports: [PyramidRulesService, PyramidRulesServiceEth],
})
export class PyramidRulesModule {}
