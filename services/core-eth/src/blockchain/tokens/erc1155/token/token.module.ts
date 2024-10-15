import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EthersModule } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { Erc1155TokenControllerEth } from "./token.controller.eth";
import { Erc1155TokenServiceEth } from "./token.service.eth";
import { Erc1155TokenServiceLog } from "./token.service.log";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    EventHistoryModule,
    TokenModule,
    BalanceModule,
    ContractModule,
    NotificatorModule,
    EthersModule.deferred(),
  ],
  providers: [Logger, signalServiceProvider, Erc1155TokenServiceLog, Erc1155TokenServiceEth],
  controllers: [Erc1155TokenControllerEth],
  exports: [Erc1155TokenServiceLog, Erc1155TokenServiceEth],
})
export class Erc1155TokenModule implements OnModuleInit {
  constructor(private readonly erc1155TokenServiceLog: Erc1155TokenServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.erc1155TokenServiceLog.initRegistry();
  }
}
