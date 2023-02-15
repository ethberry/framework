import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";
import { AccessControlServiceEth } from "./access-control.service.eth";
import { AccessControlControllerEth } from "./access-control.controller.eth";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [EventHistoryModule, TypeOrmModule.forFeature([AccessControlEntity])],
  providers: [Logger, AccessControlService, AccessControlServiceEth],
  controllers: [AccessControlControllerEth],
  exports: [AccessControlService, AccessControlServiceEth],
})
export class AccessControlModule {}
