import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { EventHistoryEntity } from "./event-history.entity";
import { EventHistoryService } from "./event-history.service";
import { ContractModule } from "../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, ConfigModule, TypeOrmModule.forFeature([EventHistoryEntity])],
  providers: [Logger, EventHistoryService],
  exports: [EventHistoryService],
})
export class EventHistoryModule {}
