import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { Erc1155TokenControllerEth } from "./token.controller.eth";
import { Erc1155TokenServiceEth } from "./token.service.eth";
import { Erc1155TokenLogModule } from "./log/log.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { signalServiceProvider } from "../../../../common/providers";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    EventHistoryModule,
    Erc1155TokenLogModule,
    TokenModule,
    BalanceModule,
    ContractModule,
    NotificatorModule,
  ],
  providers: [Logger, signalServiceProvider, Erc1155TokenServiceEth],
  controllers: [Erc1155TokenControllerEth],
  exports: [Erc1155TokenServiceEth],
})
export class Erc1155TokenModule {}
