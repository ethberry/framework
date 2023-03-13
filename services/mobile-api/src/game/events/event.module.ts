import { Logger, Module } from "@nestjs/common";

import { EventGateway } from "./event.gateway";
import { EventService } from "./event.service";

@Module({
  providers: [Logger, EventService, EventGateway],
  exports: [EventService],
})
export class EventModule {}
