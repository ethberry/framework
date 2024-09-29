import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider } from "@ethberry/nest-js-module-ethers-gcp";

import { LootBoxEntity } from "./box.entity";
import { LootBoxService } from "./box.service";
import { LootLogModule } from "./log/log.module";
import { LootBoxControllerEth } from "./box.controller.eth";
import { LootBoxServiceEth } from "./box.service.eth";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../../hierarchy/balance/balance.module";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { NotificatorModule } from "../../../../../game/notificator/notificator.module";
import { signalServiceProvider } from "../../../../../common/providers";

@Module({
  imports: [
    ConfigModule,
    TokenModule,
    AssetModule,
    BalanceModule,
    LootLogModule,
    TemplateModule,
    EventHistoryModule,
    ContractModule,
    NotificatorModule,
    TypeOrmModule.forFeature([LootBoxEntity]),
  ],
  providers: [Logger, signalServiceProvider, LootBoxService, LootBoxServiceEth, ethersRpcProvider],
  controllers: [LootBoxControllerEth],
  exports: [LootBoxService, LootBoxServiceEth],
})
export class LootBoxModule {}
