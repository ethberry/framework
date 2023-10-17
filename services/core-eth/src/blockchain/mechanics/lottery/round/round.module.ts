import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@gemunion/nest-js-module-secret-manager-gcp";

import { NotificatorModule } from "../../../../game/notificator/notificator.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { LotteryRoundEntity } from "./round.entity";
import { LotteryRoundService } from "./round.service";
import { LotteryRoundControllerEth } from "./round.controller.eth";
import { LotteryRoundServiceEth } from "./round.service.eth";
import { RoundControllerRmq } from "./round.controller.rmq";
import { LotteryRoundServiceRmq } from "./round.service.rmq";
import { LotteryRoundAggregationEntity } from "./round.aggregation.entity";
import { LotteryRoundAggregationService } from "./round.service.aggregation";
import { signalServiceProvider } from "../../../../common/providers";

@Module({
  imports: [
    NotificatorModule,
    ConfigModule,
    AssetModule,
    TemplateModule,
    TokenModule,
    ContractModule,
    EventHistoryModule,
    SecretManagerModule.deferred(),
    TypeOrmModule.forFeature([LotteryRoundEntity, LotteryRoundAggregationEntity]),
  ],
  controllers: [RoundControllerRmq, LotteryRoundControllerEth],
  providers: [
    Logger,
    ethersRpcProvider,
    ethersSignerProvider,
    signalServiceProvider,
    LotteryRoundService,
    LotteryRoundServiceEth,
    LotteryRoundServiceRmq,
    LotteryRoundAggregationService,
  ],
  exports: [LotteryRoundService, LotteryRoundServiceEth, LotteryRoundServiceRmq, LotteryRoundAggregationService],
})
export class LotteryRoundModule {}
