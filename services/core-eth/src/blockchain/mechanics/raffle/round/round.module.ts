import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@gemunion/nest-js-module-secret-manager-gcp";

import { EventHistoryModule } from "../../../event-history/event-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { UserModule } from "../../../../infrastructure/user/user.module";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleRoundService } from "./round.service";
import { RaffleRoundControllerEth } from "./round.controller.eth";
import { RaffleRoundServiceEth } from "./round.service.eth";
import { RoundControllerRmq } from "./round.controller.rmq";
import { RaffleRoundServiceRmq } from "./round.service.rmq";
import { signalServiceProvider } from "../../../../common/providers";

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
    SecretManagerModule.deferred(),
    TypeOrmModule.forFeature([RaffleRoundEntity]),
  ],
  controllers: [RoundControllerRmq, RaffleRoundControllerEth],
  providers: [
    Logger,
    ethersRpcProvider,
    ethersSignerProvider,
    signalServiceProvider,
    RaffleRoundService,
    RaffleRoundServiceEth,
    RaffleRoundServiceRmq,
  ],
  exports: [RaffleRoundService, RaffleRoundServiceEth, RaffleRoundServiceRmq],
})
export class RaffleRoundModule {}
