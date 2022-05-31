import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SeaportServiceWs } from "./seaport.service.ws";
import { SeaportControllerWs } from "./seaport.controller.ws";
import { SeaportHistoryModule } from "../seaport-history/seaport-history.module";

@Module({
  imports: [ConfigModule, SeaportHistoryModule],
  providers: [Logger, SeaportServiceWs],
  controllers: [SeaportControllerWs],
  exports: [SeaportServiceWs],
})
export class SeaportModule {}
