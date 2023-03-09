import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryEntity } from "./event-history.entity";
import { EventHistoryService } from "./event-history.service";
import { EventHistoryControllerPrivate } from "./event-history.controller.private";
import { EventHistoryControllerPublic } from "./event-history.controller.public";

@Module({
  imports: [TypeOrmModule.forFeature([EventHistoryEntity])],
  providers: [EventHistoryService],
  controllers: [EventHistoryControllerPrivate, EventHistoryControllerPublic],
  exports: [EventHistoryService],
})
export class EventHistoryModule {}
