import { Module, Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessListEntity } from "./access-list.entity";
import { AccessListService } from "./access-list.service";
import { AccessListHistoryModule } from "./access-list-history/access-list-history.module";
import { AccessListControllerEth } from "./access-list.controller.eth";
import { AccessListServiceEth } from "./access-list.service.eth";

@Module({
  imports: [AccessListHistoryModule, TypeOrmModule.forFeature([AccessListEntity])],
  controllers: [AccessListControllerEth],
  providers: [Logger, AccessListService, AccessListServiceEth],
  exports: [AccessListService],
})
export class AccessListModule {}
