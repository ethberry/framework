import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { WaitListItemModule } from "../item/item.module";
import { WaitListListControllerEth } from "./list.controller.eth";
import { WaitListListServiceEth } from "./list.service.eth";
import { WaitListListEntity } from "./list.entity";
import { WaitListListService } from "./list.service";

@Module({
  imports: [EventHistoryModule, WaitListItemModule, NotificatorModule, TypeOrmModule.forFeature([WaitListListEntity])],
  providers: [Logger, WaitListListServiceEth, WaitListListService],
  controllers: [WaitListListControllerEth],
  exports: [WaitListListServiceEth, WaitListListService],
})
export class WaitListListModule {}
