import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AchievementRuleEntity } from "./rule.entity";
import { AchievementsRuleService } from "./rule.service";
import { AchievementItemModule } from "../item/item.module";
import { EventHistoryModule } from "../../blockchain/event-history/event-history.module";
import { UserModule } from "../../infrastructure/user/user.module";
import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";

@Module({
  imports: [
    UserModule,
    ContractModule,
    forwardRef(() => EventHistoryModule),
    AchievementItemModule,
    TypeOrmModule.forFeature([AchievementRuleEntity]),
  ],
  providers: [Logger, AchievementsRuleService],
  exports: [AchievementsRuleService],
})
export class AchievementRuleModule {}
