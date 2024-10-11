import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider, EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxService } from "./box.service";
import { MysteryBoxControllerEth } from "./box.controller.eth";
import { MysteryBoxServiceEth } from "./box.service.eth";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../../hierarchy/balance/balance.module";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { NotificatorModule } from "../../../../../game/notificator/notificator.module";
import { signalServiceProvider } from "../../../../../common/providers";
import { MysteryBoxServiceLog } from "./box.service.log";

@Module({
  imports: [
    ConfigModule,
    TokenModule,
    AssetModule,
    BalanceModule,
    TemplateModule,
    EventHistoryModule,
    ContractModule,
    NotificatorModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([MysteryBoxEntity]),
  ],
  providers: [
    Logger,
    signalServiceProvider,
    MysteryBoxService,
    MysteryBoxServiceLog,
    MysteryBoxServiceEth,
    ethersRpcProvider,
  ],
  controllers: [MysteryBoxControllerEth],
  exports: [MysteryBoxService, MysteryBoxServiceLog, MysteryBoxServiceEth],
})
export class MysteryBoxModule implements OnModuleInit {
  constructor(private readonly mysteryBoxServiceLog: MysteryBoxServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.mysteryBoxServiceLog.updateRegistry();
  }
}
