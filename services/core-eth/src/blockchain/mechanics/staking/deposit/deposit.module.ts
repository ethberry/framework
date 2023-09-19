import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { StakingRulesModule } from "../rules/rules.module";
import { StakingDepositService } from "./deposit.service";
import { StakingDepositEntity } from "./deposit.entity";
import { StakingDepositControllerEth } from "./deposit.controller.eth";
import { StakingDepositServiceEth } from "./deposit.service.eth";

@Module({
  imports: [
    StakingRulesModule,
    EventHistoryModule,
    NotificatorModule,
    TypeOrmModule.forFeature([StakingDepositEntity]),
  ],
  providers: [Logger, StakingDepositService, StakingDepositServiceEth],
  controllers: [StakingDepositControllerEth],
  exports: [StakingDepositService, StakingDepositServiceEth],
})
export class StakingDepositModule {}
