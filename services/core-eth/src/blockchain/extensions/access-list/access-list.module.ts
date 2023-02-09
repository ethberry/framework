import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessListEntity } from "./access-list.entity";
import { AccessListService } from "./access-list.service";
import { AccessListHistoryModule } from "./history/history.module";
import { AccessListControllerEth } from "./access-list.controller.eth";
import { AccessListServiceEth } from "./access-list.service.eth";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [ContractModule, AccessListHistoryModule, TypeOrmModule.forFeature([AccessListEntity])],
  controllers: [AccessListControllerEth],
  providers: [Logger, AccessListService, AccessListServiceEth],
  exports: [AccessListService],
})
export class AccessListModule {}
