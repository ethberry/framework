import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { StakingRulesModule } from "../rules/rules.module";
import { StakingDepositService } from "./deposit.service";
import { StakingDepositEntity } from "./deposit.entity";
import { StakingDepositControllerEth } from "./deposit.controller.eth";
import { StakingDepositServiceEth } from "./deposit.service.eth";
import { signalServiceProvider } from "../../../../common/providers";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { StakingPenaltyModule } from "../penalty/penalty.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    TemplateModule,
    StakingRulesModule,
    StakingPenaltyModule,
    EventHistoryModule,
    NotificatorModule,
    TypeOrmModule.forFeature([StakingDepositEntity]),
  ],
  providers: [Logger, signalServiceProvider, StakingDepositService, StakingDepositServiceEth],
  controllers: [StakingDepositControllerEth],
  exports: [StakingDepositService, StakingDepositServiceEth],
})
export class StakingDepositModule {}
