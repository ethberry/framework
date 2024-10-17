import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../../common/providers";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../../game/notificator/notificator.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { WaitListItemModule } from "../item/item.module";
import { WaitListListControllerEth } from "./list.controller.eth";
import { WaitListListServiceEth } from "./list.service.eth";
import { WaitListListEntity } from "./list.entity";
import { WaitListListService } from "./list.service";
import { WaitListListServiceLog } from "./list.service.log";

@Module({
  imports: [
    EventHistoryModule,
    ContractModule,
    ConfigModule,
    WaitListItemModule,
    NotificatorModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([WaitListListEntity]),
  ],
  providers: [Logger, signalServiceProvider, WaitListListServiceLog, WaitListListServiceEth, WaitListListService],
  controllers: [WaitListListControllerEth],
  exports: [WaitListListServiceLog, WaitListListServiceEth, WaitListListService],
})
export class WaitListListModule implements OnModuleInit {
  constructor(private readonly waitListListServiceLog: WaitListListServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.waitListListServiceLog.initRegistry();
  }
}
