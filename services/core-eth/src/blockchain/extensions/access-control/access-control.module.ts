import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";
import { AccessControlServiceEth } from "./access-control.service.eth";
import { AccessControlControllerEth } from "./access-control.controller.eth";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { TokenModule } from "../../hierarchy/token/token.module";
import { NotificatorModule } from "../../../game/notificator/notificator.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [
    EventHistoryModule,
    NotificatorModule,
    ContractModule,
    TokenModule,
    TypeOrmModule.forFeature([AccessControlEntity]),
  ],
  providers: [Logger, AccessControlService, AccessControlServiceEth],
  controllers: [AccessControlControllerEth],
  exports: [AccessControlService, AccessControlServiceEth],
})
export class AccessControlModule {}
