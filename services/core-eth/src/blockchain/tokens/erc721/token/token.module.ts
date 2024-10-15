import { forwardRef, Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthersModule, ethersRpcProvider } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../common/providers";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { BreedModule } from "../../../mechanics/gaming/breed/breed.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { Erc721TokenControllerEth } from "./token.controller.eth";
import { Erc721TokenServiceEth } from "./token.service.eth";
import { Erc721TokenServiceLog } from "./token.service.log";

@Module({
  imports: [
    ConfigModule,
    EventHistoryModule,
    ContractModule,
    TemplateModule,
    BalanceModule,
    TokenModule,
    AssetModule,
    forwardRef(() => BreedModule),
    EthersModule.deferred(),
    TypeOrmModule.forFeature([TokenEntity]),
    NotificatorModule,
  ],
  providers: [signalServiceProvider, Logger, ethersRpcProvider, Erc721TokenServiceLog, Erc721TokenServiceEth],
  controllers: [Erc721TokenControllerEth],
  exports: [Erc721TokenServiceLog, Erc721TokenServiceEth],
})
export class Erc721TokenModule implements OnModuleInit {
  constructor(private readonly erc721TokenServiceLog: Erc721TokenServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.erc721TokenServiceLog.initRegistry();
  }
}
