import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ethersRpcProvider } from "@gemunion/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { BreedModule } from "../../../mechanics/breed/breed.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { Erc721TokenRandomLogModule } from "./log-random/log.module";
import { Erc721TokenRandomControllerEth } from "./token.controller.random.eth";
import { Erc721TokenRandomServiceEth } from "./token.service.random.eth";
import { Erc721TokenControllerEth } from "./token.controller.eth";
import { Erc721TokenServiceEth } from "./token.service.eth";
import { Erc721TokenLogModule } from "./log/log.module";

@Module({
  imports: [
    ConfigModule,
    EventHistoryModule,
    Erc721TokenLogModule,
    Erc721TokenRandomLogModule,
    TemplateModule,
    BalanceModule,
    TokenModule,
    AssetModule,
    forwardRef(() => BreedModule),
    TypeOrmModule.forFeature([TokenEntity]),
    NotificatorModule,
  ],
  providers: [signalServiceProvider, Logger, ethersRpcProvider, Erc721TokenServiceEth, Erc721TokenRandomServiceEth],
  controllers: [Erc721TokenControllerEth, Erc721TokenRandomControllerEth],
  exports: [Erc721TokenServiceEth],
})
export class Erc721TokenModule {}
