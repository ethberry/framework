import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider, EthersModule } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { signalServiceProvider, emlServiceProvider } from "../../../../../common/providers";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { NotificatorModule } from "../../../../../game/notificator/notificator.module";
import { UserModule } from "../../../../../infrastructure/user/user.module";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleRoundService } from "./round.service";
import { RaffleRoundControllerEth } from "./round.controller.eth";
import { RaffleRoundServiceEth } from "./round.service.eth";
import { RoundControllerRmq } from "./round.controller.rmq";
import { RaffleRoundServiceRmq } from "./round.service.rmq";
import { RaffleRoundServiceLog } from "./round.service.log";

@Module({
  imports: [
    NotificatorModule,
    ConfigModule,
    UserModule,
    AssetModule,
    TemplateModule,
    TokenModule,
    ContractModule,
    EventHistoryModule,
    EthersModule.deferred(),
    SecretManagerModule.deferred(),
    TypeOrmModule.forFeature([RaffleRoundEntity]),
  ],
  controllers: [RoundControllerRmq, RaffleRoundControllerEth],
  providers: [
    Logger,
    ethersRpcProvider,
    ethersSignerProvider,
    signalServiceProvider,
    emlServiceProvider,
    RaffleRoundService,
    RaffleRoundServiceLog,
    RaffleRoundServiceEth,
    RaffleRoundServiceRmq,
  ],
  exports: [RaffleRoundService, RaffleRoundServiceLog, RaffleRoundServiceEth, RaffleRoundServiceRmq],
})
export class RaffleRoundModule implements OnModuleInit {
  constructor(private readonly raffleRoundServiceLog: RaffleRoundServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.raffleRoundServiceLog.initRegistry();
  }
}
