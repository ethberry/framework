import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthersModule, ethersRpcProvider } from "@ethberry/nest-js-module-ethers-gcp";

import { signalServiceProvider } from "../../../../../common/providers";
import { EventHistoryModule } from "../../../../event-history/event-history.module";
import { BalanceModule } from "../../../../hierarchy/balance/balance.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { LotteryRoundModule } from "../round/round.module";
import { LotteryTicketControllerEth } from "./ticket.controller.eth";
import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketServiceEth } from "./ticket.service.eth";
import { LotteryTicketServiceLog } from "./ticket.service.log";

@Module({
  imports: [
    ConfigModule,
    ContractModule,
    TokenModule,
    AssetModule,
    TemplateModule,
    BalanceModule,
    LotteryRoundModule,
    EventHistoryModule,
    EthersModule.deferred(),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [
    Logger,
    signalServiceProvider,
    ethersRpcProvider,
    LotteryTicketService,
    LotteryTicketServiceLog,
    LotteryTicketServiceEth,
  ],
  controllers: [LotteryTicketControllerEth],
  exports: [LotteryTicketService, LotteryTicketServiceLog, LotteryTicketServiceEth],
})
export class LotteryTicketModule implements OnModuleInit {
  constructor(private readonly lotteryTicketServiceLog: LotteryTicketServiceLog) {}

  public async onModuleInit(): Promise<void> {
    await this.lotteryTicketServiceLog.updateRegistry();
  }
}
