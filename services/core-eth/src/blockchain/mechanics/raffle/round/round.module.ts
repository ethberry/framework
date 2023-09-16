import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@gemunion/nest-js-module-secret-manager-gcp";

import { RaffleRoundEntity } from "./round.entity";
import { RaffleRoundService } from "./round.service";
import { RaffleRoundServiceCron } from "./round.service.cron";
import { RaffleRoundControllerEth } from "./round.controller.eth";
import { RaffleRoundServiceEth } from "./round.service.eth";
import { RoundControllerRmq } from "./round.controller.rmq";
import { RoundServiceRmq } from "./round.service.rmq";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { UserModule } from "../../../../infrastructure/user/user.module";

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
    RaffleRoundService,
    RaffleRoundServiceEth,
    RaffleRoundServiceCron,
    RoundServiceRmq,
  ],
  exports: [RaffleRoundService, RaffleRoundServiceEth, RaffleRoundServiceCron, RoundServiceRmq],
})
export class RaffleRoundModule {}
