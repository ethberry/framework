import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { StakingDepositModule } from "../deposit/deposit.module";
import { StakingLogModule } from "../log/log.module";
import { StakingRulesControllerEth } from "./rules.controller.eth";
import { StakingRulesServiceEth } from "./rules.service.eth";
import { StakingRulesEntity } from "./rules.entity";
import { StakingRulesService } from "./rules.service";

@Module({
  imports: [
    AssetModule,
    TokenModule,
    TemplateModule,
    ContractModule,
    StakingDepositModule,
    StakingLogModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([StakingRulesEntity]),
    NotificatorModule,
  ],
  providers: [Logger, StakingRulesServiceEth, StakingRulesService],
  controllers: [StakingRulesControllerEth],
  exports: [StakingRulesServiceEth, StakingRulesService],
})
export class StakingRulesModule {}
