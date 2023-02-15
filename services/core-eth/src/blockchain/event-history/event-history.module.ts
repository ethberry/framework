import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryEntity } from "./event-history.entity";
import { EventHistoryService } from "./event-history.service";
import { ContractModule } from "../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, TypeOrmModule.forFeature([EventHistoryEntity])],
  providers: [EventHistoryService],
  exports: [EventHistoryService],
})
export class EventHistoryModule {}
