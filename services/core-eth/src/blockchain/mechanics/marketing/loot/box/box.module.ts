import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthersModule, ethersRpcProvider } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../../common/providers";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../../hierarchy/balance/balance.module";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { NotificatorModule } from "../../../../../game/notificator/notificator.module";
import { LootBoxControllerEth } from "./box.controller.eth";
import { LootBoxServiceEth } from "./box.service.eth";
import { LootBoxServiceLog } from "./box.service.log";
import { LootBoxEntity } from "./box.entity";

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
    TypeOrmModule.forFeature([LootBoxEntity]),
  ],
  providers: [Logger, signalServiceProvider, LootBoxServiceLog, LootBoxServiceEth, ethersRpcProvider],
  controllers: [LootBoxControllerEth],
  exports: [LootBoxServiceLog, LootBoxServiceEth],
})
export class LootBoxModule implements OnModuleInit {
  constructor(private readonly lootBoxServiceLog: LootBoxServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.lootBoxServiceLog.initRegistry();
  }
}
