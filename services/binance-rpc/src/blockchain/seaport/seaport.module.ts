import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SeaportServiceEth } from "./seaport.service.eth";
import { SeaportControllerEth } from "./seaport.controller.eth";
import { SeaportHistoryModule } from "../seaport-history/seaport-history.module";

@Module({
  imports: [ConfigModule, SeaportHistoryModule],
  providers: [Logger, SeaportServiceEth],
  controllers: [SeaportControllerEth],
  exports: [SeaportServiceEth],
})
export class SeaportModule {}
