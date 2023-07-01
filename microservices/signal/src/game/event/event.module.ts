import { Logger, Module } from "@nestjs/common";

import { EventGateway } from "./event.gateway";
import { EventService } from "./event.service";
// import { EventController } from "./event.controller";

@Module({
  providers: [Logger, EventService, EventGateway],
  // controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
