import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { RentableControllerEth } from "./rentable.controller.eth";
import { RentableServiceEth } from "./rentable.service.eth";
import { RentableServiceLog } from "./rentable.service.log";

@Module({
  imports: [ConfigModule, TokenModule, ContractModule, EventHistoryModule, NotificatorModule, EthersModule.deferred()],
  providers: [RentableServiceLog, RentableServiceEth],
  controllers: [RentableControllerEth],
  exports: [RentableServiceLog, RentableServiceEth],
})
export class RentableModule implements OnModuleInit {
  constructor(private readonly rentableServiceLog: RentableServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.rentableServiceLog.initRegistry();
  }
}
