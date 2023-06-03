import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingDepositModule } from "../deposit/deposit.module";
import { StakingRulesControllerEth } from "./rules.controller.eth";
import { StakingLogModule } from "../log/log.module";
import { StakingRulesServiceEth } from "./rules.service.eth";
import { StakingRulesEntity } from "./rules.entity";
import { StakingRulesService } from "./rules.service";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";

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
