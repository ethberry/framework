import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryEntity } from "./event-history.entity";
import { EventHistoryService } from "./event-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([EventHistoryEntity])],
  providers: [EventHistoryService],
  exports: [EventHistoryService],
})
export class EventHistoryModule {}
