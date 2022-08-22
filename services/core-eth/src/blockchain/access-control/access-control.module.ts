import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";
import { AccessControlHistoryModule } from "./history/history.module";
import { AccessControlServiceEth } from "./access-control.service.eth";
import { AccessControlControllerEth } from "./access-control.controller.eth";
import { ContractModule } from "../hierarchy/contract/contract.module";

@Module({
  imports: [AccessControlHistoryModule, TypeOrmModule.forFeature([AccessControlEntity]), ContractModule],
  providers: [Logger, AccessControlService, AccessControlServiceEth],
  controllers: [AccessControlControllerEth],
  exports: [AccessControlService, AccessControlServiceEth],
})
export class AccessControlModule {}
