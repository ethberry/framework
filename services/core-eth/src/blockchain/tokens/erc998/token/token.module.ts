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
import { Erc998CompositionModule } from "../composition/composition.module";
import { Erc998TokenRandomControllerEth } from "./token.controller.random.eth";
import { Erc998TokenRandomServiceEth } from "./token.service.random.eth";
import { Erc998TokenControllerEth } from "./token.controller.eth";
import { Erc998TokenServiceEth } from "./token.service.eth";
import { Erc998TokenServiceLog } from "./token.service.log";

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
    TypeOrmModule.forFeature([TokenEntity]),
    EthersModule.deferred(),
    NotificatorModule,
    Erc998CompositionModule,
  ],
  providers: [
    signalServiceProvider,
    Logger,
    ethersRpcProvider,
    Erc998TokenServiceLog,
    Erc998TokenServiceEth,
    Erc998TokenRandomServiceEth,
  ],
  controllers: [Erc998TokenControllerEth, Erc998TokenRandomControllerEth],
  exports: [Erc998TokenServiceLog, Erc998TokenServiceEth, Erc998TokenRandomServiceEth],
})
export class Erc998TokenModule implements OnModuleInit {
  constructor(private readonly erc998TokenServiceLog: Erc998TokenServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.erc998TokenServiceLog.updateRegistrySimple();
    await this.erc998TokenServiceLog.updateRegistryRandom();
  }
}
