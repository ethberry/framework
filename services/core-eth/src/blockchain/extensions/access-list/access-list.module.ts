import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessListEntity } from "./access-list.entity";
import { AccessListService } from "./access-list.service";
import { AccessListControllerEth } from "./access-list.controller.eth";
import { AccessListServiceEth } from "./access-list.service.eth";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [EventHistoryModule, TypeOrmModule.forFeature([AccessListEntity])],
  controllers: [AccessListControllerEth],
  providers: [Logger, AccessListService, AccessListServiceEth],
  exports: [AccessListService],
})
export class AccessListModule {}
