import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../common/providers";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { AccessListEntity } from "./access-list.entity";
import { AccessListService } from "./access-list.service";
import { AccessListControllerEth } from "./access-list.controller.eth";
import { AccessListServiceEth } from "./access-list.service.eth";
import { AccessListServiceLog } from "./access-list.service.log";

@Module({
  imports: [
    EventHistoryModule,
    ConfigModule,
    ContractModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([AccessListEntity]),
  ],
  providers: [Logger, AccessListService, AccessListServiceLog, AccessListServiceEth, signalServiceProvider],
  controllers: [AccessListControllerEth],
  exports: [AccessListService, AccessListServiceLog, AccessListServiceEth],
})
export class AccessListModule implements OnModuleInit {
  constructor(private readonly accessListServiceLog: AccessListServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.accessListServiceLog.updateRegistry();
  }
}
