import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryModule } from "../../event-history/event-history.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";
import { AccessControlServiceEth } from "./access-control.service.eth";
import { AccessControlControllerEth } from "./access-control.controller.eth";

@Module({
  imports: [EventHistoryModule, ContractModule, TypeOrmModule.forFeature([AccessControlEntity])],
  providers: [AccessControlService, AccessControlServiceEth],
  controllers: [AccessControlControllerEth],
  exports: [AccessControlService, AccessControlServiceEth],
})
export class AccessControlModule {}
