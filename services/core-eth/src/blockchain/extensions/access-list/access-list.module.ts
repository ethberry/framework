import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccessListEntity } from "./access-list.entity";
import { AccessListService } from "./access-list.service";
import { AccessListControllerEth } from "./access-list.controller.eth";
import { AccessListServiceEth } from "./access-list.service.eth";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [EventHistoryModule, ConfigModule, ContractModule, TypeOrmModule.forFeature([AccessListEntity])],
  controllers: [AccessListControllerEth],
  providers: [Logger, AccessListService, AccessListServiceEth, signalServiceProvider],
  exports: [AccessListService],
})
export class AccessListModule {}
