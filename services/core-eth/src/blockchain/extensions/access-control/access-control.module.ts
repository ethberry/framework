import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { EventHistoryModule } from "../../event-history/event-history.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { signalServiceProvider } from "../../../common/providers";
import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";
import { AccessControlServiceEth } from "./access-control.service.eth";
import { AccessControlControllerEth } from "./access-control.controller.eth";
import { AccessControlServiceLog } from "./access-control.service.log";

@Module({
  imports: [
    EventHistoryModule,
    ConfigModule,
    ContractModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([AccessControlEntity]),
  ],
  providers: [signalServiceProvider, AccessControlService, AccessControlServiceLog, AccessControlServiceEth],
  controllers: [AccessControlControllerEth],
  exports: [AccessControlService, AccessControlServiceLog, AccessControlServiceEth],
})
export class AccessControlModule implements OnModuleInit {
  constructor(private readonly accessControlServiceLog: AccessControlServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.accessControlServiceLog.updateRegistry();
  }
}
