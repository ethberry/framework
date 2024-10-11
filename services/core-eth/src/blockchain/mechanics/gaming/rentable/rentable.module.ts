import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { RentableEntity } from "./rentable.entity";
import { RentableService } from "./rentable.service";
import { RentableControllerEth } from "./rentable.controller.eth";
import { RentableServiceEth } from "./rentable.service.eth";
import { RentableServiceLog } from "./rentable.service.log";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    TokenModule,
    ContractModule,
    EventHistoryModule,
    NotificatorModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([RentableEntity]),
  ],
  providers: [RentableService, RentableServiceLog, RentableServiceEth],
  controllers: [RentableControllerEth],
  exports: [RentableService, RentableServiceLog, RentableServiceEth],
})
export class RentableModule implements OnModuleInit {
  constructor(private readonly rentableServiceLog: RentableServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.rentableServiceLog.updateRegistrySimple();
  }
}
