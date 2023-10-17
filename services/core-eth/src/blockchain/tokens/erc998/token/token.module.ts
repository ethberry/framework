import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ethersRpcProvider } from "@gemunion/nest-js-module-ethers-gcp";

import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { Erc998CompositionModule } from "../composition/composition.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { Erc998TokenControllerEth } from "./token.controller.eth";
import { Erc998TokenServiceEth } from "./token.service.eth";
import { Erc998TokenLogModule } from "./log/log.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { Erc998TokenRandomLogModule } from "./log-random/log.module";
import { Erc998TokenRandomControllerEth } from "./token.controller.random.eth";
import { Erc998TokenRandomServiceEth } from "./token.service.random.eth";
import { signalServiceProvider } from "../../../../common/providers";

@Module({
  imports: [
    ConfigModule,
    AssetModule,
    EventHistoryModule,
    Erc998TokenLogModule,
    Erc998TokenRandomLogModule,
    TemplateModule,
    TokenModule,
    BalanceModule,
    ContractModule,
    Erc998CompositionModule,
    NotificatorModule,
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [signalServiceProvider, Logger, ethersRpcProvider, Erc998TokenServiceEth, Erc998TokenRandomServiceEth],
  controllers: [Erc998TokenControllerEth, Erc998TokenRandomControllerEth],
  exports: [Erc998TokenServiceEth, Erc998TokenRandomServiceEth],
})
export class Erc998TokenModule {}
