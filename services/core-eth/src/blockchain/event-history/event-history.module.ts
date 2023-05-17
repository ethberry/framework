import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { EventHistoryEntity } from "./event-history.entity";
import { EventHistoryService } from "./event-history.service";
import { ContractModule } from "../hierarchy/contract/contract.module";
import { AchievementRuleModule } from "../../achievements/rule/rule.module";

@Module({
  imports: [
    ContractModule,
    ConfigModule,
    forwardRef(() => AchievementRuleModule),
    TypeOrmModule.forFeature([EventHistoryEntity]),
  ],
  providers: [Logger, EventHistoryService],
  exports: [EventHistoryService],
})
export class EventHistoryModule {}
