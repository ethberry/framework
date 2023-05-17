import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ethersRpcProvider } from "@gemunion/nestjs-ethers";

import { Erc721TokenControllerEth } from "./token.controller.eth";
import { Erc721TokenServiceEth } from "./token.service.eth";
import { Erc721TokenLogModule } from "./log/log.module";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { BreedModule } from "../../../mechanics/breed/breed.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";

@Module({
  imports: [
    ConfigModule,
    EventHistoryModule,
    Erc721TokenLogModule,
    TemplateModule,
    BalanceModule,
    TokenModule,
    AssetModule,
    forwardRef(() => BreedModule),
    TypeOrmModule.forFeature([TokenEntity]),
    NotificatorModule,
  ],
  providers: [Logger, ethersRpcProvider, Erc721TokenServiceEth],
  controllers: [Erc721TokenControllerEth],
  exports: [Erc721TokenServiceEth],
})
export class Erc721TokenModule {}
