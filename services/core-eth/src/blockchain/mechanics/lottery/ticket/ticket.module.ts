import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider } from "@gemunion/nest-js-module-ethers-gcp";

import { BalanceModule } from "../../../hierarchy/balance/balance.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { LotteryRoundModule } from "../round/round.module";
import { LotteryTicketControllerEth } from "./ticket.controller.eth";
import { LotteryTicketEntity } from "./ticket.entity";
import { LotteryTicketLogModule } from "./log/log.module";
import { LotteryTokenService } from "./token.service";
import { LotteryTicketServiceEth } from "./ticket.service.eth";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { signalServiceProvider } from "../../../../common/providers";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [
    ConfigModule,
    LotteryTicketLogModule,
    ContractModule,
    TokenModule,
    AssetModule,
    TemplateModule,
    BalanceModule,
    LotteryRoundModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [Logger, signalServiceProvider, ethersRpcProvider, LotteryTokenService, LotteryTicketServiceEth],
  controllers: [LotteryTicketControllerEth],
  exports: [LotteryTokenService, LotteryTicketServiceEth],
})
export class LotteryTicketModule {}
