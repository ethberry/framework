import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider } from "@gemunion/nest-js-module-ethers-gcp";

import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxService } from "./box.service";
import { MysteryLogModule } from "./log/log.module";
import { MysteryBoxControllerEth } from "./box.controller.eth";
import { MysteryBoxServiceEth } from "./box.service.eth";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { signalServiceProvider } from "../../../../common/providers";

@Module({
  imports: [
    ConfigModule,
    TokenModule,
    AssetModule,
    BalanceModule,
    MysteryLogModule,
    TemplateModule,
    EventHistoryModule,
    ContractModule,
    NotificatorModule,
    TypeOrmModule.forFeature([MysteryBoxEntity]),
  ],
  providers: [Logger, signalServiceProvider, MysteryBoxService, MysteryBoxServiceEth, ethersRpcProvider],
  controllers: [MysteryBoxControllerEth],
  exports: [MysteryBoxService, MysteryBoxServiceEth],
})
export class MysteryBoxModule {}
