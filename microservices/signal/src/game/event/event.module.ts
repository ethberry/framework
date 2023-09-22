import { Logger, Module } from "@nestjs/common";

import { EventGateway } from "./event.gateway";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { EventControllerRmq } from "./event.controller.rmq";

@Module({
  providers: [Logger, EventService, EventGateway],
  controllers: [EventController, EventControllerRmq],
  exports: [EventService],
})
export class EventModule {}
