import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { WaitListListControllerEth } from "./list.controller.eth";
import { WaitListListServiceEth } from "./list.service.eth";
import { WaitListListEntity } from "./list.entity";
import { WaitListListService } from "./list.service";

@Module({
  imports: [EventHistoryModule, ContractModule, NotificatorModule, TypeOrmModule.forFeature([WaitListListEntity])],
  providers: [Logger, WaitListListServiceEth, WaitListListService],
  controllers: [WaitListListControllerEth],
  exports: [WaitListListServiceEth, WaitListListService],
})
export class WaitListListModule {}
